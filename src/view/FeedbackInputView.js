import { h, render, Component } from 'preact';
import AvatarView from './AvatarView';
import TalkStarsView from './TalkStarsView';

/**
 * Input component for talk feedback
 * Properties:
 * talkFeedback: {TalkFeedback} the TalkFeedback instance to store the input
 * user: {User} the current user
 */
export default class TalkFeedbackInputView extends Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  renderAnonymous() {
    const user = this.props.user;
    return (
      <div className="ka-avatar-li ka-editing">
        <div className="ka-entry-details">
            <AvatarView user={user} />
            <div className="ka-feedback-entry">
              <a className="ka-button ka-right">Sign in</a>
              <div className="ka-author-name">
                <span className="ka-author">You must sign in to provide feedback</span>
              </div>
              <div className="ka-star-cell">
                <TalkStarsView user={user}/>
              </div>
            </div>
        </div>
      </div>
    )
  }

  onSubmit(e) {
    e.preventDefault();
    FeedbackActions.sendFeedback(this.props.feedback);
  }

  renderUser() {
    const { user, talkFeedback, message }  = this.props;
    const { rating, comment, lastModified } = talkFeedback;
    
    return (
      <div className="ka-avatar-li ka-editing">
        <form className="ka-entry-details" disabled={message && message.level == 'alert'} onSubmit={this.onSubmit}>
            <AvatarView user={user} />
            <div className="ka-feedback-entry">
              <a className="ka-button ka-right">Sign in</a>
              <div className="ka-author-name">
                <span className="ka-author">You must sign in to provide feedback</span>
              </div>
              <div className="ka-star-cell">
                <TalkStarsView user={user} talkFeedback={talkFeedback}/>
              </div>
            </div>
            <p>
              <textarea name="comment" className="ka-comment" placeholder="Share your thoughts" maxlength="255" onChange={this.onChange}>{comment}</textarea>
              <br/>
              { !message? undefined : <span className="ka-message {message.level}">{message.message}</span>}
              <button className="ka-button" type="submit">Send</button>
              <span className="ka-messages ka-hide"></span>
            </p>
        </form>
      </div>
    )

  }

  render() {
    return this.props.user.isAnonymous()? this.renderAnonymous() : this.renderUser();
  }

} 