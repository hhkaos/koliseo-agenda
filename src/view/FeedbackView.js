import { h, render, Component } from 'preact';
import { formatDate } from '../util';
import AvatarView from './AvatarView';
import StarsView from './StarsView';
import PropTypes from 'prop-types';

/**
 * Read-only view of talk feedback
 */
export default class FeedbackView extends Component {

  render() {
    const { feedback } = this.props;
    const { lastModified, user, comment } = feedback;
    
    return (
      <li className="ka-avatar-li">
        <div className="ka-entry-details">
          <AvatarView user={user}/>
          <div className="ka-feedback-entry">
            <div className="ka-author-name">
              <span className="ka-author">{user.name}</span>
              {lastModified && <span className="ka-feedback-time">{formatDate(lastModified)}</span>}
            </div>
            <div className="ka-star-cell">
              <StarsView feedback={feedback} />
            </div>
            <p>{comment}</p>
          </div>
        </div>
      </li>
    )

  }

}

FeedbackView.propTypes = {
  // {Feedback} the feedback to display
  feedback: PropTypes.object.isRequired,
}