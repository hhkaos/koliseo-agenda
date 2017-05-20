import { h, render, Component } from 'preact';
import FeedbackActions from '../actions/FeedbackActions';
import AltContainer from 'alt-ng/AltContainer';
import { FeedbackView, LoadingSkeletonView } from './FeedbackView';
import FeedbackStore from '../stores/FeedbackStore';
import FeedbackInputView from './FeedbackInputView';

/**
 * Render the list of talk feedback
 * 
 * cell: {AgendaCell, required} the cell to display
 * entries: {Array of Feedback} the list of feedback to display
 * 
 */
class FeedbackListView extends Component {

  componentDidMount() {
    FeedbackActions.fetch({
      talkId: this.props.cell.contents.id, 
      currentUser: this.context.currentUser
    })
  }

  renderLoading() {
    return [ 1, 2, 3].map((index) => <LoadingSkeletonView key={index}/>);
  }

  renderEntries(entries) {
    if (!entries) {
      return false;
    } else if (!entries.length) {
      return <div class="ka-dialog-section ka-no-feedback">There is no feedback for this talk yet.</div>;
    } else {
      return entries.map((feedback) => {
        return (
          <FeedbackView key={feedback.id} feedback={feedback}/>
        )
      })
    }
  }

  render() {
    const { currentUser, feedbackEnabled } = this.context;
    const { cell, loading, entries, currentFeedback, message } = this.props;
    return (
      <div className="ka-feedback-entries">
        <FeedbackInputView 
          talkId={cell.contents.id}
          currentFeedback={currentFeedback} 
          message={message}
          disabled={!feedbackEnabled || currentUser.readOnly}
        /> 
        { loading? this.renderLoading() : this.renderEntries(entries) }
      </div>
    )
  }

}

export default function(props) {
  return (
    <AltContainer store={FeedbackStore}>
      <FeedbackListView {...props} />
    </AltContainer>
  )
}

