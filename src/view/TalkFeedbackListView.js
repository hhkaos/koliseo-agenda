/**
 * Render the list of talk feedback
 */
export default class TalkFeedbackListView {

  constructor({ user }) {
    // {UserModel} the current user
    this.user = user;
  }

  renderItem({ view, feedback }) {
    const { user, lastModified } = feedback;
    const $lastModified = lastModified ? `<span class="ka-feedback-time"> ${formatDate(lastModified)}</span >` : '';

    return `
    <div class="ka-avatar-li ${view.className || ''}">
      <div class="ka-entry-details">
        <a href="https://www.koliseo.com/${user.uuid}" class="ka-avatar-container">
          <img class="ka-avatar-img" src="${user.avatar}">
        </a>
        <div class="ka-feedback-entry">
          <div class="ka-author-name">
            <span class="ka-author">${user.name}</span>
            ${$lastModified}
          </div>
          <div class="ka-star-cell">${new TalkStarsView({ feedback, user: this.user })}</div>
          ${ view.render() }
        </div>
      </div>
    </div>
    `

  }

  render() {
    
  }

}