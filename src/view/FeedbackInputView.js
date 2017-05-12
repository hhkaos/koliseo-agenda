import { h, render, Component } from 'preact';
import AvatarView from './AvatarView';
import StarsView from './StarsView';
import FeedbackActions from '../actions/FeedbackActions';
import Feedback from '../model/Feedback';

/**
 * Input component for talk feedback
 * Properties:
 * feedback: {Feedback} the Feedback instance to store the input
 */
export default class TalkFeedbackInputView extends Component {

  constructor() {
    super();
    this.onChange = this.onCommentChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onCommentChange(e) {
    FeedbackActions.onChange({ attribute: 'comment', value: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    !this.state.message && FeedbackActions.sendFeedback(this.props.feedback);
  }

  render() {
    const user = this.context.currentUser;
    const { currentFeedback = new Feedback({ user }), message } = this.props;
    const { rating, comment, lastModified } = currentFeedback;

    return (
      <div className="ka-avatar-li ka-editing">
        <form className="ka-entry-details" onSubmit={this.onSubmit}>
          <AvatarView user={user} />
          <div className="ka-feedback-entry">
            <a className="ka-button ka-right">Sign in</a>
            <span>{user.isAnonymous()? 'You must sign in to provide feedback' : user.name}</span>
          </div>
          <div className="ka-star-cell">
            <StarsView rating={rating} editable={true} />
          </div>
          { comment && <textarea name="comment" className="ka-comment" placeholder="Share your thoughts" maxlength="255" onChange={this.onCommentChange}>{comment}</textarea> }
          {message && <span className="ka-messages"><span className="ka-message {message.level}">{message.message}</span></span>}
          <button className="ka-button" type="submit" disabled={message && message.level == 'alert'} >Send</button>          
        </form>
      </div>
    )
  }

} 