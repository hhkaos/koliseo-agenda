import alt from '../alt';

/**
 * Actions about the user feedback
 */
const FeedbackActions = {

  generate: ['onChange'],

  sendFeedback(feedback) {
    return KoliseoAPI.sendFeedback(feedback);
  }

}

export default alt.createActions('FeedbackActions', FeedbackActions);
