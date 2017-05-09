import KoliseoAPI from './KoliseoAPI';
import AgendaView from '../view/AgendaView'
import Agenda from '../model/Agenda';
import User from '../model/User';
import CallForPapers from '../model/CallForPapers';
import { closest } from '../util';
import { h, render } from 'preact';


/**
 * The Controller takes care of handling all mouse and form events
 */
export default class AgendaBootstrap {

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

  // loads all the data and renders the component
  initAndRender() {
    const { c4pUrl, agendaUrl, oauthClientId } = this.config;
    return Promise.all([
      KoliseoAPI.getC4p(), KoliseoAPI.getAgenda(), this.initUser()
    ]).then(([c4pJSON, agendaJSON, user]) => {
      this.callForPapers = new CallForPapers(c4pJSON);
      this.agenda = new Agenda(agendaJSON);
      this.user = user;
      this.render();
      return this;
    });
  }

  render() {
    render(
      <AgendaView 
        callForPapers={this.callForPapers}
        agenda={this.agenda}
        user={this.user}
      />, this.config.element);

    const dayId = !location.hash ? '' : /#([^\/]+)(\/.+)?/.exec(location.hash)[1]
    const talkHash = dayId && location.hash.substring(1);

    const agendaDay = this.agenda.daysById[dayId] ||  this.agendaModel.getDaysArray()[0]
    AgendaActions.selectDayById(agendaDay);
    AgendaActions.selectTalkByHash(talkHash);
  }

}
