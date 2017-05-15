import { h, render, Component } from 'preact';
import AvatarView from './AvatarView';
import StarsView from './StarsView';
import FeedbackActions from '../actions/FeedbackActions';
import Feedback from '../model/Feedback';
import UserActions from '../actions/UserActions';

/**
 * Input component for talk feedback
 * Properties:
 * feedback: {Feedback} the Feedback instance to store the input
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
    !this.state.message && FeedbackActions.sendFeedback(this.props.feedback);
  }

  signIn(e) {
    UserActions.login();
  }

  renderAnonymous() {
    return (
      <div className="ka-avatar-text">
        <div className="ka-form-middle">
          <div className="ka-form-username">You must sign in to provide feedback</div>
          <StarsView rating={0} />
        </div>
        <div className="ka-form-right">
          <a className="ka-button" onClick={this.signIn}>Sign in</a>
        </div>
      </div>
    )
  }

  renderAuthenticated() {
    const { currentFeedback = new Feedback({ user }) } = this.props;
    const { rating, comment, lastModified } = currentFeedback;
    return (
      <div className="ka-avatar-text">
        <div className="ka-form-username">{user.name}</div>
        <StarsView rating={rating} editable={true} />
        <textarea
          className="ka-comment"
          placeholder="Share your thoughts"
          maxlength="255"
          onChange={this.onCommentChange}
          value={comment}
        />
        <div class="ka-talk-buttons">
          <button className="ka-button primary" type="submit" disabled={message && message.level == 'alert'}>Send</button>
        </div>
      </div>
    )

  }

  render() {
    const user = this.context.currentUser;
    const { message } = this.props;
    return (
      <form className="ka-dialog-section ka-avatar-and-text" onSubmit={this.onSubmit}>
        <AvatarView user={user} />
        { user.isAnonymous()? this.renderAnonymous() : this.renderAuthenticated() }
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