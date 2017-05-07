/**
 * Render the list of talk feedback
 */
export default class TalkFeedbackListView {

  constructor({ user }) {
    // {UserModel} the current user
    this.user = user;
  }

  render() {
    const html = `<ul class="ka-entries"></ul>`
  }

}