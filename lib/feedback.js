import util from './util';

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
          <a class="ka-button ka-right" onclick="Koliseo.auth.login()">Sign in</a>
          <div class="ka-author-name">
            <span class="ka-author">You must sign in to provide feedback</span>
          </div>
          <div class="ka-star-cell">${getStarBarTemplate(0)}</div>
        </div>
      </div>
    </li>
  `;
}

let getUserFeedbackTemplate = function({rating = 0, comment = '', lastModified, user}, isEditing) {
  let width = rating * 100 / 5;
  let $comment = isEditing? `
    <p>
      <textarea name="comment" class="ka-comment" placeholder="Share your thoughts" maxlength="255">${comment}</textarea>
      <br>
      <button class="ka-button" ${!rating? 'disabled' : ''}>Send</button>
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

class TalkFeedback {

  constructor(talk) {
    this.talk = talk || {};
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
      if (Koliseo.auth.currentUser) {
        let render = (entry) => {
          entry.user = entry.user || Koliseo.auth.currentUser;
          entry.rating = entry.rating || 0;
          let html = getUserFeedbackTemplate(entry, true);
          let $li = undefined;
          if ($feedbackEntries.children.length) {
            $li = $feedbackEntries.querySelector('.ka-avatar-li.ka-editing');
            $li && $feedbackEntries.removeChild($li);
          }
          $feedbackEntries.insertAdjacentHTML('afterbegin', html);
          Array.prototype.forEach.call($feedbackEntries.querySelectorAll('.ka-star'), (item) => {
            item.onclick = (e) => {
              let rating = e.target.dataset.rating;
              render({rating, comment: $feedbackEntries.querySelector('.ka-comment').value, user: entry.user});
            }.bind(this);
            item.onmouseover = (e) => {
              let rating = e.target.dataset.rating;
              $feedbackEntries.querySelector('.ka-star-bar').style.width = (rating * 100 / 5) + '%';
            }
            item.onmouseleave = (e) => {
              $feedbackEntries.querySelector('.ka-star-bar').style.width = (entry.rating * 100 / 5) + '%';
            }
          })
          $feedbackEntries.querySelector('.ka-button').onclick = () => {
            let comment = $feedbackEntries.querySelector('.ka-comment').value;
            Koliseo.auth.sendFeedback({id: this.talk.id, rating: entry.rating, comment}, (resp) => {
              let messages = $feedbackEntries.querySelector('.ka-messages');
              messages.innerHTML = 'Thanks for your feedback!';
              util.transitionFrom(messages, 'ka-hide');
              setTimeout(() => {
                util.transitionTo(messages, 'ka-hide');
              }, 3000);
            });
          }.bind(this)
        }
        Koliseo.auth.getCurrentUserFeedbackEntry(this.talk, render);
      } else {
        $feedbackEntries.insertAdjacentHTML('beforeend', getAnonymousUserFeedbackTemplate());
      }

      Koliseo.auth.getFeedbackEntries(this.talk.id, undefined, (entries) => {
        entries.forEach((entry) => {
          if (!Koliseo.auth.currentUser || entry.user.id !== Koliseo.auth.currentUser.id) {
            let html = getUserFeedbackTemplate(entry);
            html && $feedbackEntries.insertAdjacentHTML('beforeend', html);
          }
        })
      })
    }.bind(this);
    renderFeedbackEntries(element);
    Koliseo.auth.on('koliseo.login', () => { renderFeedbackEntries(element); }.bind(this));
    Koliseo.auth.on('koliseo.logout', () => { renderFeedbackEntries(element); }.bind(this));
  }
}

export default {

  TalkFeedback

}
