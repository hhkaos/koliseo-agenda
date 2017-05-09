import { h, render, Component } from 'preact';
import { formatDate } from '../util';
import AvatarView from './AvatarView';
import TalkStarsView from './TalkStarsView';

/**
 * Read-only view of talk feedback
 * Properties:
 * talkFeedback: {TalkFeedback} the talk feedback to display
 */
export default class TalkFeedbackView extends Component {

  render() {
    const { talkFeedback, user } = this.options;
    const lastModified = talkFeedback.lastModified ? <span className="ka-feedback-time">{formatDate(talkFeedback.lastModified)}</span > : undefined;
    return (
      <li className="ka-avatar-li">
        <div className="ka-entry-details">
          <AvatarView user={talkFeedback.user}/>
          <div className="ka-feedback-entry">
            <div className="ka-author-name">
              <span className="ka-author">{talkFeedback.user.name}</span>
              {lastModified}
            </div>
            <div className="ka-star-cell"><TalkStarsView feedback={talkFeedback} user={user}/></div>
            <p>{talkFeedback.comment}</p>
          </div>
        </div>
      </li>
    )

  }

}
