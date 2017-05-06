
/**
 * Data of the model currently logger in
 */
export default class User {

  // id: id of the current user. undefined if not logged in
  // name: name of the current user. undefined if not logged in
  // likes: array of talk IDs liked by this user. empty if not logged in.
  // readOnly: true if there is no OAuth token configured
  // loggedIn: true if the user has logged in, false for anonymous users
  constructor({ id, name, likes=[], readOnly }) {
    this.id = id;
    this.name = name;
    this.likes = likes;
    this.readOnly = readOnly;
    this.loggedIn = !!id;
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