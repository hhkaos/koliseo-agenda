/**
 * Read-only view of talk feedback
 */
export default class TalkFeedbackView {

  constructor({ talkFeedback }) {
    this.talkFeedback = talkFeedback;
  }

  render() {
    const { rating, comment, lastModified, user } = this.talkFeedback;
    const width = rating * 100 / 5;
    // comment is required with 2 stars or less
    const $comment = isEditing ? `
    <p>
      <textarea name="comment" class="ka-comment" placeholder="Share your thoughts" maxlength="255">${comment}</textarea>
      <br>
      <button class="ka-button" ${!canSendFeedback(rating, comment) ? 'disabled' : ''}>Send</button>
      <span class="ka-messages ka-hide"></span>
    </p>
  ` : comment ? `<p>${comment}</p>` : '';
      let timestamp = '';
      if (lastModified) {
        let date = new Date(lastModified);
        timestamp = `<span class="ka-feedback-time">${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</span>`;
      }
      return `
    <li class="ka-avatar-li ${isEditing ? 'ka-editing' : ''}">
      <div class="ka-entry-details">
        <a href="https://www.koliseo.com/${user.uuid}" class="ka-avatar-container">
          <img class="ka-avatar-img" src="${user.avatar}">
        </a>
        <div class="ka-feedback-entry">
          <div class="ka-author-name">
            <span class="ka-author">${user.name}</span>
            ${timestamp}
          </div>
          <div class="ka-star-cell">${getStarBarTemplate(width, isEditing)}</div>
          ${$comment}
        </div>
      </div>
    </li>
  `;

  }

}
