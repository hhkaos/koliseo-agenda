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
  fetch(cellId) {
    this.dispatch({
      payload: {
        cellId, loading: true, entries: []
      }
    });
    return KoliseoAPI.getFeedbackEntries({id : cellId}).then((entries) => {
      return {
        cellId, loading: false, entries
      }
    })
  }

}

export default alt.createActions('FeedbackActions', FeedbackActions);
