import alt from '../alt';
import Store from 'alt-ng/Store';
import FeedbackActions from '../actions/FeedbackActions';
import Feedback from '../model/Feedback';

// minimum number of stars that should be assigned to send without a comment
const MIN_STARS_WIHOUT_COMMENT = 3;


class FeedbackStore extends Store {

  constructor() {
    super();
    this.state = {
      // {int, required} id of the current talk being displayed
      // talkId

      // {boolean} loading state
      // loading

      // {Array of Feedback, empty if loading or none} list of feedback for the current talk being displayed
      // entries

      // {Feedback, undefined if none} feedback by the current user, 
      // currentFeedback

      // feedback message
      // message
    }
    this.bindActions(FeedbackActions);
  }

  // add the page of feedback to the list
  // currently we are not paging these but a cursor could be added easily
  fetch({ talkId, loading, entries, currentUser, firstPage }) {
    if (firstPage) {
      // Starting. Reset state
      this.setState({
        talkId,
        loading,
        entries,
        currentFeedback: new Feedback({user: currentUser})
      })
    } else if (talkId == this.state.talkId) {
      // we just received a page of results
      let currentFeedback = this.state.currentFeedback;
      const processedEntries = entries.map((entry) => {
        const result = new Feedback(entry);
        if (result.user.id == currentUser.id) {
          currentFeedback = result;
        }
        return result;
      })
      this.setState({
        talkId, 
        loading, 
        entries: processedEntries,
        currentFeedback
      })
    }
  }

  // change the rating or the comment of the feedback of this user
  onChange({ attribute, value }) {
    const currentFeedback = this.state.currentFeedback;
    currentFeedback[attribute] = value;

    const { comment, rating } = currentFeedback;
    const message = comment.trim()? undefined :
      rating >= MIN_STARS_WIHOUT_COMMENT && rating < 5? {
        message: 'The author would appreciate your comment',
        level: 'warn'
      } : rating < MIN_STARS_WIHOUT_COMMENT? {
        message: 'Comment is required for 2 stars or less',
        level: 'alert'
      } : undefined;

    this.setState({
      currentFeedback,
      message
    })
  }

  // feedback already sent by the action
  sendFeedback(feedback) {
    this.setState({
      message: {
        level: 'info',
        message: 'Thanks for your feedback!'
      }
    });
    setTimeout(() => this.setState({ message: null }), 1000);
  }

}
export default alt.createStore('FeedbackStore', new FeedbackStore());
