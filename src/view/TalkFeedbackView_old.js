import util from '../util';
import TalkStarsView from './TalkStarsView';

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
          <div class="ka-star-cell">${new TalkStarsView({ userModel: this.userModel }).render()}</div>
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

export default class TalkFeedbackView {

  constructor({ talk, userModel }) {
    this.talk = talk;
    this.userModel = userModel;
  }

  isFeedbackEnabled() {
    return Koliseo.agenda.model.feedbackEnabled;
  }


  renderFeedbackEntries(element) {
    let renderFeedbackEntries = (element) => {
      element.innerHTML = '';
      element.insertAdjacentHTML('beforeend', '<ul class="ka-entries"></ul>');
      let $feedbackEntries = element.querySelector('.ka-entries');
      if (this.isFeedbackEnabled()) {
        if (!this.userModel.readOnly) {
          let render = (entry) => {
            entry.user = entry.user || this.userModel;
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
        } else if (!this.userModel.readOnly) {
          $feedbackEntries.insertAdjacentHTML('beforeend', getAnonymousUserFeedbackTemplate());
          $feedbackEntries.querySelector('.ka-button').onclick = KoliseoAPI.login();
        }
      }

      KoliseoAPI.getFeedbackEntries(this.talk.id, undefined, (entries) => {
        entries.forEach((entry) => {
          if (this.userModel.isLoggedIn() || entry.user.id !== this.userModel.id) {
            let html = getUserFeedbackTemplate(entry);
            html && $feedbackEntries.insertAdjacentHTML('beforeend', html);
          }
        })
      })
    };
    renderFeedbackEntries(element);
  }
}

