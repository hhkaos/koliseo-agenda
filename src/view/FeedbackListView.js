import { h, render, Component } from 'preact';
import FeedbackActions from '../actions/FeedbackActions';
import PropTypes from 'prop-types';
import AltContainer from 'alt-ng/AltContainer';
import FeedbackView from './FeedbackView';
import FeedbackStore from '../stores/FeedbackStore';
import FeedbackInputView from './FeedbackInputView';

/**
 * Render the list of talk feedback
 * 
 * {Number, required} the cell id to display
 * cellId
 *
 * {Array of Feedback} the list of feedback to display
 * entries
 */
class FeedbackListView extends Component {

  componentDidMount() {
    FeedbackActions.fetch(this.props.cellId, this.context.currentUser)
  }

  renderLoading() {
    // todo: display entries skeleton
    return <div class="loading">Loading...</div>
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
    const { feedbackEnabled, loading, entries, currentFeedback } = this.props;
    return (
      <div className="ka-feedback-entries">
        {feedbackEnabled && <FeedbackInputView feedback={currentFeedback} /> }
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

