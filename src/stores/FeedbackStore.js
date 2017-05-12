import alt from '../alt';
import Store from 'alt-ng/Store';
import FeedbackActions from '../actions/FeedbackActions';
import Feedback from '../model/Feedback';

class FeedbackStore extends Store {

  constructor() {
    super();
    this.state = {
      // {int, required} id of the current talk being displayed
      // cellId

      // {boolean} loading state
      // loading

      // {Array of Feedback, empty if loading or none} list of feedback for the current talk being displayed
      // entries

      // {Feedback, undefined if none} feedback by the current user, 
      // currentFeedback
    }
    this.bindActions(FeedbackActions);
  }

  // add the page of feedback to the list
  // currently we are not paging these but a cursor could be added easily
  fetch({ cellId, loading, entries, currentUser }) {

    // either fetch just started (we are in a loading state)
    // or we just received results, in which case accept if they are only for our latest request
    if (loading || cellId == this.state.cellId) {
      let currentFeedback;
      const processedEntries = entries.map((entry) => {
        if (entry.user.id == currentUser.id) {
          currentFeedback = new Feedback(entry);
        }
        return new Feedback(entry);
      })
      this.setState({
        cellId, 
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
    this.setState({
      currentFeedback,
      message: currentFeedback.getMessage()
    })
  }

  // feedback already sent by the action
  sendFeedback(feedback) {
    setState({
      message: {
        level: 'info',
        message: 'Thanks for your feedback!'
      }
    })
  }

}
export default alt.createStore('FeedbackStore', new FeedbackStore());
