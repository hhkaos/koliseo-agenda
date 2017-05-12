import User from './User';

// minimum number of stars that should be assigned to send without a comment
const MIN_STARS_WIHOUT_COMMENT = 3;

/**
 * Talk feedback
 */
export default class Feedback {

  constructor({ rating = 0, comment = '', lastModified, user }) {
    // {int, 1-5} the number of stars provided by the user
    this.rating = rating;

    // {String, optional} the comment
    this.comment = comment;

    // {JSON Object} the user that created the feedback entry
    this.user = new User(user);

    // {Date, optional} the date of last modification 
    this.lastModified = lastModified? new Date(lastModified) : undefined;
  }

  // get the warning message if the feedback is not yet ready to be sent
  getMessage() {
    const { comment, rating } = this;
    if (!comment.trim()) {
      if (rating >= MIN_STARS_WIHOUT_COMMENT && rating < 5) {
        return {
          message: 'The author would appreciate your comment',
          level: 'warn'
        }
      } else {
        return {
          message: 'Comment is required for 2 stars or less',
          level: 'alert'
        }
      }
    }
    return undefined;
  }

}