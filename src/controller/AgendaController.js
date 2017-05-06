import KoliseoAPI from './KoliseoAPI';
import AgendaView from '../view/AgendaView'
import Agenda from '../model/Agenda';
import User from '../model/User';
import CallForPapers from '../model/CallForPapers';
import { closest } from '../util';

/**
 * The Controller takes care of handling all mouse and form events
 */
export default class AgendaController {

  constructor({
    // {String, required} URL to retrieve the C4P
    c4pUrl,

    // {String, optional} URL to retrieve the agenda
    agendaUrl = c4pUrl + '/agenda',
    
    // {String, required} The element to use to render the agenda
    element,  
    
    // {String, optional}. The Koliseo OAuth client ID
    oauthClientId, 
  }) {
    this.config = {
      c4pUrl, 
      agendaUrl,
      element,
      oauthClientId
    }
    KoliseoAPI.init({ c4pUrl, oauthClientId });
    this.renderView = this.renderView.bind(this);
  }

  init() {
    const { c4pUrl, agendaUrl, oauthClientId } = this.config;
    Promise.all([
      KoliseoAPI.getC4p(), KoliseoAPI.getAgenda(), this.initUser()
    ]).then(([c4pJSON, agendaJSON, user]) => {
      this.CallForPapers = new CallForPapers(c4pJSON);
      this.agenda = new Agenda(agendaJSON);
      this.user = user;

      const element = this.config.element;
      element.addEventListener('click', this.onClick.bind(this));
      element.addEventListener('keyup', this.onKeyPress.bind(this));
      this.renderView();
    }).catch(e => {
      console.log(e);
    });
  }


  initUser() {
    return Promise.all([
      KoliseoAPI.getCurrentUser(), KoliseoAPI.getCurrentUserLikes()
    ]).then(([user, likes]) => {
      const readOnly = !this.config.oauthClientId;
      return new User(Object.assign({ 
        likes, readOnly
      }, user));
    }).catch((e) => {
      if (e.status == 401 || e.status == 403) {
        // not logged in, empty User
        return new User({ 
          likes: [], readOnly  
        });
      }
      throw e;
    })
  }

  renderView() {
    this.view = new AgendaView({
      CallForPapers: this.CallForPapers,
      agenda: this.agenda,
      user: this.user,
      element: this.config.element
    });
    this.view.renderWorkspace();

    const dayId = !location.hash ? '' : /#([^\/]+)(\/.+)?/.exec(location.hash)[1]
    const talkHash = dayId && location.hash.substring(1);
    const agendaDay = this.agenda.daysById[dayId] || this.agendaModel.getDaysArray()[0]
    this.selectDay(agendaDay);
    this.selectTalk(talkHash);
  }

  // main controller listener. Reacts to all mouse events
  onClick(e) {
    let target = e.target;
    if (target && event.button == 0 && !event.ctrlKey && !event.metaKey) {
      const classList = target.classList;
      if (classList.contains('ka-like')) {
        e.preventDefault();
        this.onClickLike(target);
      } else if (classList.contains('ka-talk-title')) {
        event.preventDefault();
        this.onClickTalk(target);
      } else if (classList.contains('ka-tab-a')) {
        event.preventDefault();
        const dayId = target.getAttribute('data-day-id');
        this.selectDay(agendaModel.daysById[dayId]);
      } else if (classList.contains('ka-close') || classList.contains('ka-overlay')) {
        this.unselectTalk();
      }
    }

  }

  onKeyPress(event) {
    if (this.selectedTalkHash && !event.altKey && !event.ctrlKey) {
      const keyCode = event.keyCode;
      if (keyCode == 27) {
        // escape key while viewing a talk closes the window
        this.unselectTalk();
      } 
    }
  }

  onClickTalk(target) {
    const hash = target.getAttribute('href').substring(1);
    this.selectTalk(hash);
  }

  onClickLike(target) {
    if (!KoliseoAPI.currentUser) {
      KoliseoAPI.login();
      return;
    }
    const user = this.user;
    let talkId = +target.dataset.talkId;
    debugger; // todo
    if (!user.isLiked(talkId)) {
      KoliseoAPI.addLike(talkId).then(() => {
        user.addLike(talkId);
        target.dataset.state = 'default';
        target.placeholder = "Click to mark this talk as favorite"
      });
    } else {
      KoliseoAPI.removeLike(talkId).then(() => {
        user.removeLike(talkId);
        target.dataset.state = 'selected';
        target.placeholder = "I am planning to attend this talk"
      });
    }
  }

  // select a day given its id
  // the ID must exist
  selectDay(dayModel) {
    this.pushState(dayModel.name, dayModel.id);
    this.view.renderDay(dayModel);
  }

  getSelectedTableModel() {
    return this.models[this.selectedDayId];
  }


  // render a talk as modal window, by hash
  // returns the talk if found, otherwise undefined
  selectTalk(hash) {
    const talk = this.talksByHash[hash];
    if (talk) {

      if (this.selectedTalkHash) {
        this.unselectTalk();
      }

      const tableModel = this.getSelectedTableModel();
      this.selectedTalkHash = hash;

      this.dialog = new TalkDialog({
        talk: talk.contents,
        tagColors: this.tagColors
      }).render();
      this.pushState(talk.title, hash);
    }
    return talk;
  }

  unselectTalk() {
    if (this.dialog) {
      this.dialog.hide();
      this.dialog = undefined;
    }
    this.selectedTalkHash = undefined;
    const $selected = document.querySelector('.ka-table-td.selected');
    $selected && $selected.classList.remove('selected');
    this.selectedDayId && this.pushState(this.models[this.selectedDayId].name, this.selectedDayId);
  }

  // add the status to the location hash
  pushState(title, hash) {
    if (typeof history !== 'undefined' && history.pushState) {
      history.pushState({}, title, location.pathname + location.search + '#' + hash);
    }
  }

}