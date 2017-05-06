

/**
 * Controls the UI for sending feedback of a talk
 */
export default class TalkFeedbackController {

  constructor() {
    
  }

  ${!canSendFeedback(rating, comment) ? 'disabled': ''
}

  onCommentInput(event) {
    if (canSendFeedback(entry.rating, $comment.value)) {
      $sendButton.removeAttribute('disabled');
    } else {
      $sendButton.disabled = true;
    }
    showCommentMessage({
      comment: $comment.value,
      rating: entry.rating
    })

  }


}