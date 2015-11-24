let getRatingTemplate = function({rating, comment = ''}) {
  const renderSingleStar = (value) => {
    return `<a data-rating="${value}" class="ka-star ${rating >= value? 'active' : ''}"></a>`
  }
  return `
    <div class="ka-feedback-form">
      <div>
        ${[1,2,3,4,5].map(renderSingleStar).join('')}
      </div>
      <textarea name="comment" class="ka-comment" placeholder="Comment" maxlength="255">${comment}</textarea>
      <br>
      <button class="ka-button" ${!rating? 'disabled' : ''}>Send</button>
    </div>
  `;
}

let getStarBarTemplate = function(width) {
  return `
    <div class="ka-star-rating">
      <span class="ka-star-bar" style="width: ${width}%"></span>
    </div>
  `;
}

let getUserFeedbackTemplate = function({rating, comment, user}) {
  if (Koliseo.auth.currentUser && user.id === Koliseo.auth.currentUser.id) {
    return '';
  }
  let width = rating * 100 / 5;
  return `
    <li class="ka-avatar-li">
      <div class="ka-entry-details">
        <a href="https://www.koliseo.com/${user.uuid}" class="ka-avatar-container">
          <img class="ka-avatar-img" src="${user.avatar}">
        </a>
        <div class="ka-feedback-entry">
          <span class="ka-author-name">${user.name}</span>
          <div class="ka-star-cell">${getStarBarTemplate(width)}</div>
          ${comment? `<p>${comment}</p>` : ''}
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
    return getStarBarTemplate(width);
  }

  renderFeedbackEntries(element) {
    let renderFeedbackEntries = (element) => {
      element.innerHTML = undefined;
      if (Koliseo.auth.currentUser) {
        let render = (entry) => {
          let html = getRatingTemplate(entry);
          element.innerHTML = html;
          Array.prototype.forEach.call(element.querySelectorAll('.ka-star'), (item) => {
            item.onclick = (e) => {
              let rating = e.target.dataset.rating;
              render({rating, comment: element.querySelector('.ka-comment').value});
            }.bind(this);
          })
          element.querySelector('.ka-button').onclick = () => {
            let comment = element.querySelector('.ka-comment').value;
            Koliseo.auth.sendFeedback({id: this.talk.id, rating: entry.rating, comment}, (resp) => {
              console.log('Feedback received!');
            });
          }.bind(this)
        }
        Koliseo.auth.getCurrentUserFeedbackEntry(this.talk, render);
      }
      let $feedbackEntries = element.parentElement.querySelector('.ka-entries');
      if (!$feedbackEntries) {
        element.insertAdjacentHTML('afterend', '<ul class="ka-entries"></ul>');
        $feedbackEntries = element.parentElement.querySelector('.ka-entries');
      }
      Koliseo.auth.getFeedbackEntries(this.talk.id, undefined, (entries) => {
        entries.forEach((entry) => {
          $feedbackEntries.insertAdjacentHTML('beforeend', getUserFeedbackTemplate(entry));
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
