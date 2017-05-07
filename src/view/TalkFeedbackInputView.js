/**
 * Input component for talk feedback
 */
export default class TalkFeedbackInputView {

  constructor({ 
    // the talk feedback of the current user, if any
    talkFeedback, 

    // the current user
    user 
  }) {
    this.talkFeedback = talkFeedback;
    this.user = user;
  }

  renderAnonymous() {
    const user = this.user;
    return `
    <li class="ka-avatar-li ka-editing">
      <div class="ka-entry-details">
        ${new AvatarView(user).render()}
          <div class="ka-feedback-entry">
            <a class="ka-button ka-right">Sign in</a>
            <div class="ka-author-name">
              <span class="ka-author">You must sign in to provide feedback</span>
            </div>
            <div class="ka-star-cell">${new TalkStarsView({ user: this.user }).render()}</div>
          </div>
      </div>
    </li>
`
  }

  renderUser(user) {
    const { rating, comment, lastModified } = this.talkFeedback;
    return `
    <li class="ka-avatar-li ka-editing">
      <form class="ka-entry-details">
        ${new AvatarView(user).render()}
          <div class="ka-feedback-entry">
            <a class="ka-button ka-right">Sign in</a>
            <div class="ka-author-name">
              <span class="ka-author">You must sign in to provide feedback</span>
            </div>
            <div class="ka-star-cell">${new TalkStarsView({ user, talkFeedback: this.talkFeedback }).render()}</div>
          </div>
          <p>
            <textarea name="comment" class="ka-comment" placeholder="Share your thoughts" maxlength="255">${comment}</textarea>
            <br>
            <button class="ka-button" type="submit">Send</button>
            <span class="ka-messages ka-hide"></span>
          </p>
      </form>
    </li>
    `

  }

  render() {
    return this.user.isAnonymous()? this.renderAnonymous() : this.renderUser();
  }
} 