import alt from '../alt';

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

  

}

export default alt.createActions('AgendaActions', AgendaActions);
