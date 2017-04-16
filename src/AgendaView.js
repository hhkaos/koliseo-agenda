import { AgendaDayTemplate } from './AgendaDayTemplate';
import AgendaDayTableModel from './AgendaDayTableModel';
import { closest } from './util';
import TalkDialog from './TalkDialog';
import KoliseoAPI from './KoliseoAPI';
import LikeButtonUtils from './LikeButtonUtils';

/**

  Displays an entire agenda, including multiple days

*/

export default class AgendaView {

  constructor({
    c4p, // JSON for the C4P
    agenda, // contents of the agenda as JSON
    currentUser,
    likes,
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

    if (!KoliseoAPI.readOnly) {
      this.element.onclick = LikeButtonUtils.onClickListener;
      LikeButtonUtils.addUpdateListener(this.element);
    }

  }

  render() {
    const dayId = !location.hash? '' : /#([^\/]+)(\/.+)?/.exec(location.hash)[1]
    const talkHash = dayId && location.hash.substring(1);
    const html =
      (this.days.length > 1? this.renderDayTabs() : `<div class="ka-right" id="ka-user-info"></div><h2 class="kday-title">${this.days[0].name}</h2>`) +
      this.renderWorkspace() +
      this.renderHint();
    this.element.classList.add('ka');
    this.element.innerHTML = html;
    document.body.addEventListener('click', this.onClick.bind(this));
    document.body.addEventListener('keyup', this.onKeyPress.bind(this));

    this.selectDay(dayId);
    const talk = this.selectTalk(talkHash);
    this.scrollToTalk(talk);

    if (!KoliseoAPI.readOnly) {
      this.renderUserInfo();
    }

    // after rendering, fill the likes info
    if (KoliseoAPI.currentUser) {

    KoliseoAPI.getCurrentUserLikes().then((likes) => {

todo();
    })
    }

  }

  renderDayTabs() {

    const tabLinks = this.days.map(({ id, name }) => {
      return `
        <li class="ka-tab-li">
        <a class="ka-tab-a" data-day-id="${id}" href="#${id}">${name}</a>
        </li>
      `
    }).join('');

    return `
      <ul class="ka-tabs">
        ${tabLinks}
        <li class="ka-tab-li ka-right" id="ka-user-info"></li>
      </ul>
    `
  }

  renderUserInfo() {
    var container = document.getElementById('ka-user-info');
    container.innerHTML = !KoliseoAPI.currentUser?
      `<button class="ka-button">Sign in</button>` :
      `<button class="ka-button ka-button-secondary">Sign out</button>`
    ;
    container.onclick = () => {
      (!KoliseoAPI.currentUser? KoliseoAPI.login() : KoliseoAPI.logout()).
         then(() => this.renderUserInfo());
    };
  }

  renderWorkspace() {
    return `<div class="kworkspace"></div>`
  }

  renderHint() {
    return `
      <div class="ka-hint">
        <a href="http://koliseo.com" target="_blank" class="ka-logo"></a>
        <p class="ka-hint-p small">Handcrafted with ♥ at 30,000 feet of altitude, some point between Madrid and Berlin</p>
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
    Array.prototype.forEach.call(this.element.querySelectorAll('.ka-tab-a'), (a) => {
      // .toggle(className, value) does not work in IE 10
      a.classList[a.getAttribute('data-day-id') === dayId? 'add' : 'remove']('selected')
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

      const $a = document.querySelector(`.ka-talk-title[data-hash="${hash}"]`);
      const $cellContent = this.$cellContent = closest($a, '.ka-table-td');
      const rect = $cellContent.getBoundingClientRect();
      const tableModel = this.getSelectedTableModel();

      this.selectedTalkHash = hash;
      this.selectedTalkCoords = tableModel.getCoords(talk.id);

      //$cellContent.classList.add('selected')
      this.dialog = new TalkDialog({
        talk: talk.contents,
        tagColors: this.tagColors
      }).render();
      this.pushState(talk.title, hash);
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

  // add the status to the location hash
  pushState(title, hash) {
    if (typeof history !== 'undefined' && history.pushState) {
      history.pushState({}, title, location.pathname + location.search + '#' + hash);
    }
  }

  unselectTalk() {
    if (this.dialog) {
      this.dialog.hide();
      this.dialog = undefined;
    }
    this.selectedTalkHash = undefined;
    this.selectedTalkCoords = undefined;
    const $selected = document.querySelector('.ka-table-td.selected');
    $selected && $selected.classList.remove('selected');
    this.selectedDayId && this.pushState(this.models[this.selectedDayId].name, this.selectedDayId);
  }

  scrollToTalk(talk) {
    if (talk && talk.contents) {
      const $element = document.querySelector(`.ka-talk-title[data-id="${talk.contents.id}"]`);
      $element && $element.scrollIntoView(true);
    }
  }

  onClick(event) {
    const target = event.target;
    if (target && event.button == 0 && !event.ctrlKey && !event.metaKey) {
      const classList = target.classList;
      if (classList.contains('ka-talk-title')) {
        event.preventDefault();
        if (closest(target, '.selected')) {
          this.unselectTalk();
        } else {
          const hash = target.getAttribute('href').substring(1);
          const talk = this.selectTalk(hash);
        }
      } else if (classList.contains('ka-tab-a')) {
        event.preventDefault();
        this.selectDay(target.getAttribute('data-day-id'));
      } else if (classList.contains('ka-close') || classList.contains('ka-overlay')) {
        this.unselectTalk();
      } else if (classList.contains('ka-table-th')) {
        const parentClassList = target.parentElement.classList;
        if (parentClassList.contains('ka-expanded')) {
          parentClassList.remove('ka-expanded');
        } else {
          parentClassList.add('ka-expanded');
        }
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
        this.onClose();
      }
    }
  }

};
