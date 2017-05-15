import { h, render, Component } from 'preact';
import FeedbackActions from '../actions/FeedbackActions';
import AltContainer from 'alt-ng/AltContainer';
import { FeedbackView, LoadingSkeletonView } from './FeedbackView';
import FeedbackStore from '../stores/FeedbackStore';
import FeedbackInputView from './FeedbackInputView';

/**
 * Render the list of talk feedback
 * 
 * {AgendaCell, required} the cell to display
 * cell
 *
 * {Array of Feedback} the list of feedback to display
 * entries
 * 
 * {boolean} true if feedback is enabled
 * feedbackEnabled
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
      return <div class="no-feedback"></div>;
    } else {
      return entries.map((feedback) => {
        return (
          <FeedbackView key={feedback.id} feedback={feedback}/>
        )
      })
    }
  }

  render() {
    const currentUser = this.context.currentUser;
    const { feedbackEnabled, loading, entries, currentFeedback } = this.props;
    return (
      <div className="ka-feedback-entries">
        { 
          feedbackEnabled && !currentUser.readOnly && 
          <FeedbackInputView feedback={currentFeedback} /> 
        }
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

