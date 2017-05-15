import { h, render, Component } from 'preact';
import { formatDate } from '../util';
import AvatarView from './AvatarView';
import StarsView from './StarsView';

/**
 * Read-only view of talk feedback
 * 
 * {Feedback} the feedback to display
 * feedback
 */
export function FeedbackView({ feedback }) {

  const { lastModified, user, comment } = feedback;
  
  return (
    <div className="ka-dialog-section ka-avatar-and-text">
      <AvatarView user={user}/>
      <div className="ka-avatar-text">
        <div className="ka-feedback-author">
          {user.name} {lastModified && <span className="ka-feedback-time">{formatDate(lastModified)}</span>}
        </div>
        <StarsView rating={feedback.rating} />
        <div className="ka-feedback-comment">{comment}</div>
      </div>
    </div>
  )

}

/**
 * Skeleton placeholder while loading
 */
export function LoadingSkeletonView() {
  return (
    <div className="ka-dialog-section ka-avatar-and-text loading">
      <div className="ka-avatar-a loading" />
      <div className="ka-avatar-text loading"></div>
    </div>
  )
}