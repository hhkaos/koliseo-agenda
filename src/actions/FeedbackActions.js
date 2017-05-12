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
  fetch(cellId, currentUser) {
    this.dispatch({
      payload: {
        cellId, loading: true, entries: [], currentUser
      }
    });
    return KoliseoAPI.getFeedbackEntries({id : cellId}).then((response) => {
      return {
        cellId, loading: false, entries: response.data, currentUser
      }
    })
  }

}

export default alt.createActions('FeedbackActions', FeedbackActions);
