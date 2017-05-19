import alt from '../alt';
import Store from 'alt-ng/Store';
import FeedbackActions from '../actions/FeedbackActions';
import Feedback from '../model/Feedback';

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

      // feedback warning message
      // feedbackWarning
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
        if (entry.user.id == currentUser.id) {
          currentFeedback = new Feedback(entry);
        }
        return new Feedback(entry);
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
    this.setState({
      currentFeedback,
      feedbackWarning: currentFeedback.getMessage()
    })
  }

  // feedback already sent by the action
  sendFeedback(feedback) {
    setState({
      feedbackWarning: {
        level: 'info',
        message: 'Thanks for your feedback!'
      }
    })
  }

}
export default alt.createStore('FeedbackStore', new FeedbackStore());
