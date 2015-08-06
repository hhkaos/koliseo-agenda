import { AgendaDayTemplate } from './AgendaDayTemplate';
import { AgendaDayTableModel } from './AgendaDayTableModel';

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

    // the agenda table data, indexed by agendaDay.id
    this.models = {};

    // the DOM element to modify
    this.element = element;
  }

  render() {
    const html =
      (this.days.length > 1? this.renderDayTabs() : '') +
      this.renderWorkspace();
    this.element.classList.add('kagenda');
    this.element.innerHTML = html;
    this.selectTab(location.hash || (this.days[0].id + ''));
  }

  renderDayTabs() {
    return (
`
<ul class="kagenda-tabs">
${this.renderTabLinks()}
</ul>
`
    )
  }

  renderWorkspace() {
    return `<div class="kworkspace"></div>`
  }

  renderTabLinks() {
    return this.days.map(({ id, name }) => {
      return (
`
<li class="kagenda-tab-li">
<a class="kagenda-tab-a" data-day-id="${id}">${name}</a>
</li>
`
      )
    }).join('')

  }

  // Select a day from the agenda
  // dayId the identifier of this day. May include a hash
  selectTab(dayId) {
    dayId = dayId.replace('#', ''); // remove hash
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
  }

};

export { AgendaView }
