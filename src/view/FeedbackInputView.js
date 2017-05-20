import { h, render, Component } from 'preact';
import AvatarView from './AvatarView';
import StarsView from './StarsView';
import FeedbackActions from '../actions/FeedbackActions';
import Feedback from '../model/Feedback';
import { LoginLogoutButton } from './Buttons';
import throttle from 'lodash.throttle';

/**
 * Input component for talk feedback
 * Properties:
 * feedback: {Feedback} the Feedback instance to store the input
 * disabled: {boolean} true to disable the form
 * talkId: {number} the id of the talk being rated
 */
export default class FeedbackInputView extends Component {

  constructor() {
    super();
    this.onCommentChange = throttle(this.onCommentChange.bind(this), 300);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRatingChange = this.onRatingChange.bind(this);
  }

  onCommentChange(e) {
    FeedbackActions.onChange({ 
      attribute: 'comment', 
      value: e.target.value 
    });
  }

  onRatingChange(rating) {
    FeedbackActions.onChange({
      attribute: 'rating',
      value: rating
    });
  }

  // return true if the form can be submitted
  canBeSubmitted() {
    const { currentFeedback, message } = this.props;
    return currentFeedback && 
      currentFeedback.rating > 0 &&
      (!message || message.level !== 'alert')
      ;
  }

  onSubmit(e) {
    e.preventDefault();
    this.canBeSubmitted() && FeedbackActions.sendFeedback(this.props.talkId, this.props.currentFeedback);
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
    const { currentFeedback = new Feedback({ user }), message } = this.props;
    const { rating, comment, lastModified } = currentFeedback;
    return (
      <div className="ka-avatar-text">
        <div className="ka-form-middle">
          <div className="ka-form-username">{user.name}</div>
          <StarsView 
            rating={rating} 
            editable={true} 
            onChange={this.onRatingChange}
          />
          <textarea
            className="ka-feedback-comment"
            placeholder="Share your thoughts"
            maxlength="255"
            onInput={this.onCommentChange}
            value={comment}
          />
          {
            message &&
            <span className={"ka-message " + message.level}>
              {message.message}
            </span>
          }
          <button 
            className="ka-button" 
            type="submit" 
            disabled={!this.canBeSubmitted()}>Send</button>
        </div>
      </div>
    )

  }

  render() {
    const user = this.context.currentUser;
    const { disabled } = this.props;
    return (
      <form className="ka-dialog-section ka-avatar-and-text ka-feedback-form" disabled={disabled} onSubmit={this.onSubmit}>
        <AvatarView user={user} />
        { disabled || user.isAnonymous()? this.renderAnonymous(disabled) : this.renderAuthenticated() }
      </form>
    )
  }

}