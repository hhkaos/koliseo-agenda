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

  render() {
    const user = this.context.currentUser;
    const { currentFeedback = new Feedback({ user }), message } = this.props;
    const { rating, comment, lastModified } = currentFeedback;

    return (
      <form className="ka-dialog-section ka-avatar-and-text" onSubmit={this.onSubmit}>
        <AvatarView user={user} />
        <div className="ka-avatar-text">
          <a className="ka-button">Sign in</a>
          <span>{user.isAnonymous()? 'You must sign in to provide feedback' : user.name}</span>
          <StarsView rating={rating} editable={true} />
          {
            !user.isAnonymous() && 
            <textarea 
              className="ka-comment" 
              placeholder="Share your thoughts" 
              maxlength="255" 
              onChange={this.onCommentChange} 
              value={comment}
            />
          }
          {
            message && 
            <span className="ka-messages">
              <span className="ka-message {message.level}">     
                {message.message}
              </span>
            </span>
          }
          <button className="ka-button primary" type="submit" disabled={message && message.level == 'alert'}>Send</button>          
        </div>
      </form>
    )
  }

}