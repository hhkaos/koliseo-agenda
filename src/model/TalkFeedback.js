// minimum number of stars that I should be assigning to be able to send without a comment
const MIN_STARS_WIHOUT_COMMENT = 3;

/**
 * Talk feedback
 */
export default class TalkFeedback {

  constructor({ rating = 0, comment = '', lastModified, user }) {
    // {int, 1-5} the number of stars provided by the user
    this.rating = rating;

    // {String, optional} the comment
    this.comment = comment;

    // {JSON Object} the user that created the feedback entry
    this.user = user;

    // {Date, optional} the date of last modification 
    this.lastModified = lastModified? new Date(lastModified) : undefined;
  }

  // return true if this feedback can be sent
  // below MIN_STARS_WITHOUT_COMMENT, a comment would be required
  isComplete() {
    return this.rating >= MIN_STARS_WIHOUT_COMMENT || this.rating >= 1 && !!this.comment.trim();
  }

}