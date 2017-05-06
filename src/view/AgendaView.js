import { AgendaDayView } from './AgendaDayView';
import TalkDialog from './TalkDialog';

/**

  Displays an entire agenda, including multiple days

  @class
*/

export default class AgendaView {

  constructor({
    c4pModel, // JSON for the C4P
    agendaModel, // contents of the agenda as JSON
    user,
    element // DOM node to render everything into
  }) {
    // the original JSON data
    this.c4pModel = c4pModel;
    this.agendaModel = agendaModel;
    this.pageTitle = document.title;
    this.user = user;
    this.element = element;

    this.tagColors = {};
    c4pModel.tagCategories && Object.keys(c4pModel.tagCategories).forEach((tagCategoryName, index) => this.tagColors[tagCategoryName] = index);

    // the DOM element to modify
    this.element = element;
  }

  // renders the tabs and content around our table
  renderWorkspace() {
    const html =
      this.renderUserInfo() +
      this.renderDayTabs() +
      `
      <div class="kworkspace"></div>
      <div class="ka-hint">
        <a href="http://koliseo.com" target="_blank" class="ka-logo"></a>
        <p class="ka-hint-p small">Handcrafted with ♥ in a couple of places scattered around Europe</p>
      </div>`;
    this.element.classList.add('ka');
    this.element.innerHTML = html;
  }

  // render the tabs to move between days
  renderDayTabs() {
    const days = this.agendaModel.getDaysArray();
    if (days.length == 1) 
      return `<h2 class="kday-title">${days[0].name}</h2>`;

    const tabLinks = this.agendaModel.getDaysArray().map(({ id, name }) => {
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

  // render the user info and login/logout button
  // if there is no OAuth client ID, does not show anything at all
  renderUserInfo() {
    const user = this.user;
    if (user.readOnly) {
      return '';
    }
    const button = user.isAnonymous() ?
      '<button class="ka-button">Sign in</button>' :
      '<button class="ka-button ka-button-secondary">Sign out</button>';
    return `<div class="ka-right" id="ka-user-info">${button}</div>`;
    ;
  }

  renderDay(dayModel) {

    // mark selected tab
    Array.prototype.forEach.call(this.element.querySelectorAll('.ka-tab-a'), (a) => {
      a.classList[a.getAttribute('data-day-id') === dayModel.id ? 'add' : 'remove']('selected')
    })

    // render table
    this.element.querySelector('.kworkspace').innerHTML =
      new AgendaDayView(dayModel).render();

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


};
