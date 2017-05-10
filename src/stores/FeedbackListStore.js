import alt from '../alt';
import Store from 'alt-ng/Store';
import FeedbackActions from '../actions/FeedbackActions';
import Feedback from '../model/Feedback';

class FeedbackListStore extends Store {

  constructor() {
    super();
    this.state = {
      // {int} id of the current talk being displayed
      // cellId

      // {boolean} loading state
      // loading

      // {Array of Feedback} list of feedback for the current talk being displayed
      // entries
    }
    this.bindAction(FeedbackActions.fetch, this.fetch);
  }

  // add the page of feedback to the list
  // currently we are not paging these but a cursor could be added easily
  fetch({ cellId, loading, entries }) {
    // either fetch just started (we are in a loading state)
    // or we just received results, in which case accept if they are only for our latest request
    if (loading || cellId == this.state.cellId) {
      this.setState({
        cellId, loading, entries: entries.map(entry => new Feedback(entry))
      })
    }
  }

}
export default alt.createStore('FeedbackListStore', new FeedbackListStore());
