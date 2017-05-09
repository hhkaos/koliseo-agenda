import alt from '../alt';
import KoliseoAPI from '../controller/KoliseoAPI';
import CallForPapers from '../model/CallForPapers';
import Agenda from '../model/Agenda';

/**
 * Actions about the agenda
 */
const AgendaActions = {

  generate: [ 'selectTalkByHash', 'unselectTalk', 'selectDayById' ],

  like(user, talkId) {
    if (!user.isLiked(talkId)) {
      return KoliseoAPI.addLike(talkId).then(() => {
        user.addLike(talkId);
        target.dataset.state = 'default';
        target.placeholder = "Click to mark this talk as favorite"
        return { talkId, liked: true };
      });
    } else {
      KoliseoAPI.removeLike(talkId).then(() => {
        user.removeLike(talkId);
        target.dataset.state = 'selected';
        target.placeholder = "I am planning to attend this talk"
        return { talkId, liked: false };
      });
    }
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
