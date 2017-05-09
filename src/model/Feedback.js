
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
    this.user = user;

    // {Date, optional} the date of last modification 
    this.lastModified = lastModified? new Date(lastModified) : undefined;
  }

}