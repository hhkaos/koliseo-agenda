import alt from '../alt';
import KoliseoAPI from '../controller/KoliseoAPI';
import CallForPapers from '../model/CallForPapers';
import Agenda from '../model/Agenda';

/**
 * Actions about the agenda
 */
const AgendaActions = {

  generate: [ 'selectTalkByHash', 'unselectTalk', 'selectDayById' ],

  addLike(user, talkId) {
    return KoliseoAPI.addLike(talkId).then(() => {
      user.addLike(talkId);
    });
  },

  removeLike(user, talkId) {
    return KoliseoAPI.removeLike(talkId).then(() => {
      user.removeLike(talkId);
    });
  },

  // loads the agenda and c4p
  load() {
    return Promise.all([
      KoliseoAPI.getC4p(), KoliseoAPI.getAgenda()
    ]).then(([c4pJSON, agendaJSON]) => { 
      return { 
        callForPapers: new CallForPapers(c4pJSON),
        agenda: new Agenda(agendaJSON)
      }
    }) 
  }

}

export default alt.createActions('AgendaActions', AgendaActions);
