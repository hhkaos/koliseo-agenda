
/**
 * Data of the model currently logger in
 */
export default class User {

  // id: internal id of the current user. undefined if not logged in
  // uuid: the public identifier of this user
  // name: name of the current user. undefined if not logged in
  // likes: array of talk IDs liked by this user. empty if not logged in.
  // readOnly: true if there is no OAuth token configured
  constructor(userData) {
    Object.assign(this, { likes: [] }, userData);
  }

  // return true if the user has not logged in
  isAnonymous() {
    return !this.id;
  }

  // return true if the talk ID is liked by the current user
  isLiked(talkId) {
    return this.likes.indexOf(talkId) !== -1;
  }

  addLike(talkId) {
    if (!this.isLiked(talkId)) {
      this.likes.push(talkId);
    }
  }

  removeLike(talkId) {
    const index = this.likes.indexOf(talkId);
    if (index !== -1) {
      this.likes.splice(index, 1);
    }
  }

}