import util from './util';
import KoliseoAPI from './KoliseoAPI';

const MIN_STARS_WIHOUT_COMMENT = 3;

let getStarBarTemplate = function(width, isEditing) {
  return `
    <div class="ka-star-rating">
      <span class="ka-star-bar" style="width: ${width}%"></span>
      ${!isEditing? '' : [1,2,3,4,5].map((star) => {
        return `<a data-rating="${star}" title="${star} ${star > 1? 'stars' : 'star' }" class="ka-star ka-star-${star}"></a>`;
      }).join('')}
    </div>
  `;
}

let getAnonymousUserFeedbackTemplate = function() {
  return `
    <li class="ka-avatar-li ka-editing">
      <div class="ka-entry-details">
        <span class="ka-avatar-container">
          <img class="ka-avatar-img" src="https://www.koliseo.com/less/img/avatar.gif">
        </span>
        <div class="ka-feedback-entry">
          <a class="ka-button ka-right">Sign in</a>
          <div class="ka-author-name">
            <span class="ka-author">You must sign in to provide feedback</span>
          </div>
          <div class="ka-star-cell">${getStarBarTemplate(0)}</div>
        </div>
      </div>
    </li>
  `;
}

let canSendFeedback = (rating, comment) => {
  return rating >= MIN_STARS_WIHOUT_COMMENT || rating >= 1 && !!comment.trim();
}

let getUserFeedbackTemplate = function({rating = 0, comment = '', lastModified, user}, isEditing) {
  let width = rating * 100 / 5;
  // comment is required with 2 stars or less
  let $comment = isEditing? `
    <p>
      <textarea name="comment" class="ka-comment" placeholder="Share your thoughts" maxlength="255">${comment}</textarea>
      <br>
      <button class="ka-button" ${!canSendFeedback(rating, comment)? 'disabled' : ''}>Send</button>
      <span class="ka-messages ka-hide"></span>
    </p>
  ` : comment? `<p>${comment}</p>` : '';
  let timestamp = '';
  if (lastModified) {
    let date = new Date(lastModified);
    timestamp = `<span class="ka-feedback-time">${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</span>`;
  }
  return `
    <li class="ka-avatar-li ${isEditing? 'ka-editing': ''}">
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

let showMessage = function({element, message, level, hide = true}) {
  element.innerHTML = `<span class="ka-message ${level}">${message}</span>`;
  util.transitionFrom(element, 'ka-hide');
  hide && setTimeout(() => {
    util.transitionTo(element, 'ka-hide');
  }, 3000);
}

export default class TalkFeedback {

  constructor(talk) {
    this.talk = talk || {};
  }

  isFeedbackEnabled() {
    return Koliseo.agenda.model.feedbackEnabled;
  }

  renderFeedback() {
    let width = (this.talk.feedback && this.talk.feedback.ratingAverage * 100 / 5) || 0;
    return width? getStarBarTemplate(width) : '';
  }

  renderFeedbackEntries(element) {
    let renderFeedbackEntries = (element) => {
      element.innerHTML = '';
      element.insertAdjacentHTML('beforeend', '<ul class="ka-entries"></ul>');
      let $feedbackEntries = element.querySelector('.ka-entries');
      if (this.isFeedbackEnabled()) {
        if (!KoliseoAPI.readOnly) {
          let render = (entry) => {
            entry.user = entry.user || KoliseoAPI.currentUser;
            entry.rating = entry.rating || 0;
            let html = getUserFeedbackTemplate(entry, true);
            let $li = undefined;
            if ($feedbackEntries.children.length) {
              $li = $feedbackEntries.querySelector('.ka-avatar-li.ka-editing');
              $li && $feedbackEntries.removeChild($li);
            }
            $feedbackEntries.insertAdjacentHTML('afterbegin', html);
            let $comment = $feedbackEntries.querySelector('.ka-comment');
            let $sendButton = $feedbackEntries.querySelector('.ka-button');
            let $messages = $feedbackEntries.querySelector('.ka-messages');
            let showCommentMessage = ({comment = '', rating}) => {
              $messages.innerHTML && ($messages.innerHTML = '');
              if (!comment.trim() && rating > 0 && rating < 5) {
                if (rating >= MIN_STARS_WIHOUT_COMMENT) {
                  showMessage({
                    message: 'The author would appreciate your comment',
                    element: $messages,
                    level: 'warn',
                    hide: false
                  })
                } else {
                  showMessage({
                    message: 'Comment is required for 2 stars or less',
                    element: $messages,
                    level: 'alert',
                    hide: false
                  })
                }
              }
            }
            showCommentMessage(entry);
            Array.prototype.forEach.call($feedbackEntries.querySelectorAll('.ka-star'), (item) => {
              item.onclick = (e) => {
                let rating = e.target.dataset.rating;
                let comment = $comment.value;
                render({rating, comment, user: entry.user});
                showCommentMessage({rating, comment});
              };
              item.onmouseover = (e) => {
                let rating = e.target.dataset.rating;
                $feedbackEntries.querySelector('.ka-star-bar').style.width = (rating * 100 / 5) + '%';
              }
              item.onmouseleave = (e) => {
                $feedbackEntries.querySelector('.ka-star-bar').style.width = (entry.rating * 100 / 5) + '%';
              }
            })
            $comment.onkeyup = (e) => {
              if (canSendFeedback(entry.rating, $comment.value)) {
                $sendButton.removeAttribute('disabled');
              } else {
                $sendButton.disabled = true;
              }
              showCommentMessage({
                comment: $comment.value,
                rating: entry.rating
              })
            };
            $sendButton.onclick = () => {
              let comment = $comment.value;
              KoliseoAPI.sendFeedback({id: this.talk.id, rating: entry.rating, comment}, (resp) => {
                showMessage({
                  message: 'Thanks for your feedback!',
                  element: $messages
                })
              });
            }
          }
          KoliseoAPI.getCurrentUserFeedbackEntry(this.talk, render);
        } else if (!KoliseoAPI.readOnly) {
          $feedbackEntries.insertAdjacentHTML('beforeend', getAnonymousUserFeedbackTemplate());
          $feedbackEntries.querySelector('.ka-button').onclick = KoliseoAPI.login;
        }
      }

      KoliseoAPI.getFeedbackEntries(this.talk.id, undefined, (entries) => {
        entries.forEach((entry) => {
          if (!KoliseoAPI.currentUser || entry.user.id !== KoliseoAPI.currentUser.id) {
            let html = getUserFeedbackTemplate(entry);
            html && $feedbackEntries.insertAdjacentHTML('beforeend', html);
          }
        })
      })
    };
    renderFeedbackEntries(element);
    KoliseoAPI.on('login', () => { renderFeedbackEntries(element); });
    KoliseoAPI.on('logout', () => { renderFeedbackEntries(element); });
  }
}

