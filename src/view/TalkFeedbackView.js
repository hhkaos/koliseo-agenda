import { formatDate } from '../util';

/**
 * Read-only view of talk feedback
 */
export default class TalkFeedbackView {

  constructor({ talkFeedback }) {
    this.talkFeedback = talkFeedback;
  }

  render() {
    const feedback = this.talkFeedback;
    const { user, lastModified } = feedback;
    const $lastModified = lastModified ? `<span class="ka-feedback-time"> ${formatDate(lastModified)}</span >` : '';
    return `
      <li class="ka-avatar-li">
        <div class="ka-entry-details">
          ${new AvatarView(user).render()}
          <div class="ka-feedback-entry">
            <div class="ka-author-name">
              <span class="ka-author">${user.name}</span>
              ${$lastModified}
            </div>
            <div class="ka-star-cell">${new TalkStarsView({ feedback, user: this.user })}</div>
            <p>${comment}</p>
          </div>
        </div>
      </li>
    `

  }

}
