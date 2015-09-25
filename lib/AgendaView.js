import { AgendaDayTemplate } from './AgendaDayTemplate';
import { AgendaDayTableModel } from './AgendaDayTableModel';
import { closest, debug } from './util';
import { TalkDetailsRow } from './TalkDetailsRow';

/**

  Displays an entire agenda, including multiple days

*/
class AgendaView {

  constructor({
    c4p, // JSON for the C4P
    agenda, // contents of the agenda as JSON
    element // DOM node to render everything into
  }) {
    // the original JSON data
    this.c4p = c4p;
    this.days = agenda.days;
    this.pageTitle = document.title;

    // this.selectedDayId
    // this.selectedTalkHash
    // this.selectedTalkCoords

    // all talks indexed by dayId/talkId
    this.talksByHash = {};
    agenda.days.forEach((day) => {
      day.tracks.forEach((track) => {
        track.slots.forEach((slot) => {
          if (slot.contents && slot.contents.type === 'TALK') {
            const hash = slot.contents.hash = day.id + '/' + slot.id;
            this.talksByHash[hash] = slot;
          }
        })
      })
    })

    this.tagColors = {};
    c4p.tagCategories && Object.keys(c4p.tagCategories).forEach((tagCategoryName, index) => this.tagColors[tagCategoryName] = index);

    // the agenda table data, indexed by agendaDay.id
    this.models = {};

    // the DOM element to modify
    this.element = element;
  }

  render() {
    const dayId = !location.hash? '' : /#([^\/]+)(\/.+)?/.exec(location.hash)[1]
    const talkHash = dayId && location.hash.substring(1);
    const html =
      (this.days.length > 1? this.renderDayTabs() : `<h2 class="kday-title">${this.days[0].name}</h2>`) +
      this.renderWorkspace() +
      this.renderHint();
    this.element.classList.add('kagenda');
    this.element.innerHTML = html;
    document.body.addEventListener('click', this.onClick.bind(this));
    document.body.addEventListener('keyup', this.onKeyPress.bind(this));

    this.selectDay(dayId);
    const talk = this.selectTalk(talkHash);
    this.scrollToTalk(talk);
  }

  renderDayTabs() {

    const tabLinks = this.days.map(({ id, name }) => {
      return `
        <li class="kagenda-tab-li">
        <a class="kagenda-tab-a" data-day-id="${id}" href="#${id}">${name}</a>
        </li>
      `
    }).join('');

    return `
      <ul class="kagenda-tabs">
      ${tabLinks}
      </ul>
    `
  }

  renderWorkspace() {
    return `<div class="kworkspace"></div>`
  }

  renderHint() {
    return `
      <div class="hint">
        <a href="http://koliseo.com" target="_blank"><img src="https://www.koliseo.com/css/img/logo.svg" alt="Powered by Koliseo" class="kagenda-logo"></a>
        <p class="hint-p">Using a keyboard? Try using the cursors to move between talks</p>
        <p class="hint-p small">Handcrafted with ♥ at 30,000 feet of altitude, some point between Madrid and Berlin</p>
      </div>
    `
  }

  // Select a day from the agenda
  // dayId the identifier of this day. May include a hash
  selectDay(dayId) {
    dayId = this.days.filter(day => day.id == dayId).length? dayId : this.days[0].id + '';
    this.selectedDayId = dayId;

    let dayTableModel = this.models[dayId];
    if (!dayTableModel) {
      const selectedDay = this.days.filter((day) => day.id == dayId)[0];
      dayTableModel = this.models[dayId] = new AgendaDayTableModel(selectedDay);
    }

    // mark selected tab
    Array.prototype.forEach.call(this.element.querySelectorAll('.kagenda-tab-a'), (a) => {
      a.classList.toggle('selected', a.getAttribute('data-day-id') === dayId)
    })

    // render table
    this.element.querySelector('.kworkspace').innerHTML =

      new AgendaDayTemplate(dayTableModel).render();

    this.pushState(dayTableModel.name, dayId);

  }

  // render a talk as modal window, by hash
  // returns the talk if found, otherwise undefined
  selectTalk(hash, fadeInClass) {
    const talk = this.talksByHash[hash];
    if (talk) {

      if (this.selectedTalkHash) {
        this.unselectTalk();
      }

      const $a = document.querySelector(`.kagenda-talk-title[data-hash="${hash}"]`);
      const $cellContent = this.$cellContent = closest($a, '.kagenda-table-td');
      const $tr = this.rowForDetails($cellContent);
      const rect = $cellContent.getBoundingClientRect();
      const tableModel = this.getSelectedTableModel();

      $cellContent.classList.add('selected')
      this.selectedTalkHash = hash;
      this.selectedTalkCoords = tableModel.getCoords(talk.id);
      $tr.insertAdjacentElement('afterEnd', new TalkDetailsRow({
        talk: talk.contents,
        tagColors: this.tagColors
      }).render(tableModel.colLabels.length + 1));
      this.pushState(talk.title, hash);
      this.hideOverlappingCells($tr);
    }
    return talk;
  }

  getSelectedTableModel() {
    return this.models[this.selectedDayId];
  }

  // calculate the TR to insert a new row after. It depends on the value of rowspan
  rowForDetails($td) {
    const rowSpan = parseInt($td.getAttribute('rowSpan') || '1');
    let $tr = $td.parentElement;
    for (var i = 1; i < rowSpan; i++) {
      $tr = $tr.nextElementSibling;
    }
    return $tr;
  }

  // hide any cell with a rowSpan that would overlap with the details cell
  hideOverlappingCells($tr) {
    let distance = 1;
    while ($tr) {
      Array.prototype.forEach.call($tr.children, $td => {
        if ($td.rowSpan > distance) {
          $td.classList.add('hidden');
        }
      })
      $tr = $tr.previousElementSibling;
      distance++;
    }
  }

  // add the status to the location hash
  pushState(title, hash) {
    if (typeof history !== 'undefined' && history.pushState) {
      history.pushState({}, title, location.pathname + location.search + '#' + hash);
    }
  }

  unselectTalk() {
    this.selectedTalkHash = undefined;
    this.selectedTalkCoords = undefined;
    const $selected = document.querySelector('.kagenda-table-td.selected');
    $selected && $selected.classList.remove('selected');
    const $details = document.querySelector('.kagenda-talk-details');
    $details && $details.remove();

    // display overlapping cells again
    Array.prototype.forEach.call(document.querySelectorAll('.kagenda-table-td.hidden'), $td => $td.classList.remove('hidden'))
  }

  scrollToTalk(talk) {
    if (talk && talk.contents) {
      const $element = document.querySelector(`.kagenda-talk-title[data-id="${talk.contents.id}"]`);
      $element && $element.scrollIntoView(true);
    }
  }

  onClick(event) {
    const target = event.target;
    if (target) {
      if (target.classList.contains('kagenda-talk-title')) {
        event.preventDefault();
        const hash = target.getAttribute('href').substring(1);
        const talk = this.selectTalk(hash);
      } else if (target.classList.contains('kagenda-tab-a')) {
        event.preventDefault();
        this.selectDay(target.getAttribute('data-day-id'));
      }
    }
  }

  onClose() {
    this.unselectTalk();
  }

  onKeyPress(event) {
    if (this.selectedTalkHash && !event.altKey && !event.ctrlKey && !event.shiftKey) {
      const keyCode = event.keyCode;
      if (keyCode == 27) {
        this.modal.close();
      }

      const rowDelta =
        keyCode == 38? -1 :
        keyCode == 40? 1 :
        0;
      const colDelta =
        keyCode == 37? -1 :
        keyCode == 39? 1 :
        0;
      if (rowDelta || colDelta) {
        const fadeInClass =
          rowDelta == -1? 'up' :
          rowDelta == 1? 'down' :
          colDelta == -1? 'left' :
          colDelta == 1? 'right' :
          '';
        const talk = this.getSelectedTableModel().findTalk(this.selectedTalkCoords, { rowDelta, colDelta});
        if (talk) {
          this.selectTalk(talk.contents.hash, fadeInClass);
          event.preventDefault();
        }
      }
    }
  }

};

export { AgendaView }
