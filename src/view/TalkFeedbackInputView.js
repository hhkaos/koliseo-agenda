/**
 * Input component for talk feedback
 */
export default class TalkFeedbackInputView {

  constructor({ talkFeedback }) {
    this.talkFeedback = talkFeedback;
    this.className = 'ka-editing'
  }

  render() {
    const { rating, comment, lastModified, user } = this.talkFeedback;
    return `
      <p>
        <textarea name="comment" class="ka-comment" placeholder="Share your thoughts" maxlength="255">${comment}</textarea>
        <br>
        <button class="ka-button">Send</button>
        <span class="ka-messages ka-hide"></span>
      </p>
      `
  }
} 