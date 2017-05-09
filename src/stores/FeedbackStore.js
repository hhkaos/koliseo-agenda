import alt from '../alt';
import Store from 'alt-ng/Store';
import FeedbackActions from '../actions/FeedbackActions';

// minimum number of stars that should be assigned to send without a comment
const MIN_STARS_WIHOUT_COMMENT = 3;

class FeedbackStore extends Store {

  constructor() {
    super();
    this.state = {
      // { level, message } warning message
      // message

      // { Feedback } the feedback provided by this user to this talk
      //feedback
    }
    this.bindActions(FeedbackActions);
  }

  load(feedback) {
    this.onChange(feedback);
  }

  onChange(feedback) {
    const { comment, rating } = feedback;
    let message = undefined;
    if (!comment.trim()) {
      if (rating >= MIN_STARS_WIHOUT_COMMENT) {
        message = {
          message: 'The author would appreciate your comment',
          level: 'warn'
        }
      } else {
        message = {
          message: 'Comment is required for 2 stars or less',
          level: 'alert'
        }
      }
    }
    this.setState({
      feedback,
      message
    })
  }

  // feedback already sent by the action
  sendFeedback(feedback) {
    setState({
      message: {
        level: 'info',
        message: 'Thanks for your feedback!'
      },
      feedback
    })
  }


};

export default alt.createStore('FeedbackStore', new FeedbackStore());