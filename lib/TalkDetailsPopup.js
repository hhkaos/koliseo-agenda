import { formatMarkdown } from './stringutils';
import { strToEl } from './util';
import { TalkFeedback } from './feedback';
import LikeButtonUtils from './LikeButtonUtils';

class TalkDetailsPopup {

  constructor({ talk, tagColors }) {
    this.talk = talk;
    this.tagColors = tagColors;
    this.feedback = new TalkFeedback(talk);
  }

  render() {

    const talk = this.talk;
    let links = [];
    links.push(LikeButtonUtils.renderButton(talk.id));
    talk.slidesUrl && links.push(`<a href="${talk.slidesUrl}" target="_blank" class="icon-slideshare" title="Slides"><span class="sr-only">Slides in new window of "${talk.title}"</span></a>`)
    talk.videoUrl && links.push(`<a href="${talk.videoUrl}" target="_blank" class="icon-youtube-play" title="Video"><span class="sr-only">Video in new window of "${talk.title}"</span></a>`)
    let linkContainer = !links.length? '' : `<div class="ka-links ka-right">
      ${links.join('')}
    </div>`;
    const html = `
      <div class="ka-talk-details-window">
        <a class="ka-close" title="close"></a>
        <div class="ka-talk-details-viewport">
          <div class="ka-talk-details-inner">
            <div class="ka-talk-details-contents">
              <h2 class="ka-talk-details-title">${linkContainer} ${talk.title} ${this.feedback.renderFeedback()}</h2>
              <div class="ka-talk-details-description">${formatMarkdown(talk.description)}</div>
              ${this.renderTags(talk.tags)}
              ${this.renderAuthors('ka-medium-down')}
              <div class="ka-feedback-entries"></div>
            </div>
            ${this.renderAuthors('ka-medium-up')}
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    document.querySelector('.ka-overlay').classList.remove('ka-hidden');
    this.feedback.renderFeedbackEntries(document.querySelector('.ka-feedback-entries'));

    let detailsContent = document.querySelector('.ka-talk-details-contents');
    LikeButtonUtils.addUpdateListener(detailsContent);
    detailsContent.querySelector('.ka-like').onclick = LikeButtonUtils.onClickListener;
  }

  renderAuthors(className) {
    return `
      <ul class="ka-avatars ${className}">
        ${this.talk.authors.map(this.renderAuthor).join('')}
      </ul>
    `
  }

  renderTags() {
    const tags = this.talk.tags;
    if (!tags) {
      return '';
    }
    return '<div class="ka-tags">' +
      Object.keys(tags).map(category => {
        return tags[category].map(tag => `<span class="tag tag${this.tagColors[category]}">${tag}</span>`).join(' ')
      }).join(' ') +
      '</div>'
  }

  renderAuthor({ id, uuid, name, avatar, description, twitterAccount }) {
    avatar = avatar.indexOf('//') == 0? ('https:' + avatar) : avatar;
    let $name = `<a href="https://www.koliseo.com/${uuid}" class="ka-author-name">${name}</a>`;
    return `
      <li class="ka-avatar-li ka-avatar-and-text">
        <span class="ka-avatar-container">
          <span style="display:table-row">
            <a href="https://www.koliseo.com/${uuid}" class="ka-avatar-img"><img src="${avatar}" class="ka-avatar-img"></a>
            ${
              !twitterAccount? $name : `
              <span class="ka-author-name-container">
                ${$name}
                <a href="https://twitter.com/${twitterAccount}" class="ka-author-twitter" target="_blank">@${twitterAccount}</a>
              </span>`
            }
          </span>
        </span>
        <div class="ka-author-data">
          <div class="ka-author-description">${formatMarkdown(description)}</div>
        </div>
      </li>
    `
  }


};

export { TalkDetailsPopup };
