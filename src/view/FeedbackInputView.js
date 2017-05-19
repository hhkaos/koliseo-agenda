import { h, render, Component } from 'preact';
import AvatarView from './AvatarView';
import StarsView from './StarsView';
import FeedbackActions from '../actions/FeedbackActions';
import Feedback from '../model/Feedback';
import { LoginLogoutButton } from './Buttons';

/**
 * Input component for talk feedback
 * Properties:
 * feedback: {Feedback} the Feedback instance to store the input
 * disabled: {boolean} true to disable the form
 */
export default class FeedbackInputView extends Component {

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
    !this.state.message && !this.props.disabled && FeedbackActions.sendFeedback(this.props.feedback);
  }

  renderAnonymous(disabled) {
    return (
      <div className="ka-avatar-text">
        <div className="ka-form-middle">
          <div className="ka-form-username">
            { 
              disabled? 'Feedback for this event has been disabled' : 'You must sign in to provide feedback'
            }
          </div>
          <StarsView rating={0} />
        </div>
        <div className="ka-form-right">
          <LoginLogoutButton />
        </div>
      </div>
    )
  }

  renderAuthenticated() {
    const user = this.context.currentUser;
    const { currentFeedback = new Feedback({ user }), feedbackWarning } = this.props;
    const { rating, comment, lastModified } = currentFeedback;
    return (
      <div className="ka-avatar-text">
        <div className="ka-form-middle">
          <div className="ka-form-username">{user.name}</div>
          <StarsView rating={rating} editable={true} />
          <textarea
            className="ka-feedback-comment"
            placeholder="Share your thoughts"
            maxlength="255"
            onChange={this.onCommentChange}
            value={comment}
          />
          <button className="ka-button" type="submit" disabled={feedbackWarning && feedbackWarning.level == 'alert'}>Send</button>
        </div>
      </div>
    )

  }

  render() {
    const user = this.context.currentUser;
    const { message, disabled } = this.props;
    return (
      <form className="ka-dialog-section ka-avatar-and-text ka-feedback-form" disabled={disabled} onSubmit={this.onSubmit}>
        <AvatarView user={user} />
        { user.isAnonymous()? this.renderAnonymous(disabled) : this.renderAuthenticated() }
        {
          message && 
          <span className="ka-messages">
            <span className="ka-message {message.level}">     
              {message.message}
            </span>
          </span>
        }
      </form>
    )
  }

}