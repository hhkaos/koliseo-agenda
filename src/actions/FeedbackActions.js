import alt from '../alt';
import KoliseoAPI from '../controller/KoliseoAPI';

/**
 * Actions about the user feedback
 */
const FeedbackActions = {

  generate: ['onChange'],

  sendFeedback(feedback) {
    return KoliseoAPI.sendFeedback(feedback);
  },

  // fetch Feedback entries for a given talk
  fetch({ talkId, currentUser, cursor}) {

    // if first page, display loading
    const firstPage = !cursor;
    firstPage && this.dispatch({
      payload: {
        talkId, 
        loading: true, 
        entries: [], 
        currentUser,
        firstPage
      }
    });
    return KoliseoAPI.getFeedbackEntries({
      id : talkId,
      cursor
    }).then(({ data, cursor }) => {
      this.preventDefault();
      this.dispatch({
        payload: {
          talkId, 
          loading: !!cursor, 
          entries: data, 
          currentUser
        }
      });
      return cursor? alt.actions.FeedbackActions.fetch({talkId, currentUser, cursor}) : undefined;
    })
  }

}

export default alt.createActions('FeedbackActions', FeedbackActions);
