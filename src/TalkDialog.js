import { formatMarkdown } from './stringutils';
import { strToEl, transitionTo, transitionFrom } from './util';
import TalkFeedback from './TalkFeedback';
import LikeButtonUtils from './LikeButtonUtils';

export default class TalkDialog {

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
    <div class="ka-overlay ka-hidden">
      <div class="ka-dialog">
        <a class="ka-close" title="close"></a>
        <div class="ka-dialog-contents">
          <h2 class="ka-dialog-title">${linkContainer} ${talk.title} ${this.feedback.renderFeedback()}</h2>
          <div class="ka-dialog-description">${formatMarkdown(talk.description)}</div>
          ${this.renderTags(talk.tags)}
        </div>
        <ul class="ka-avatars">
          ${talk.authors.map(this.renderAuthor).join('')}
        </ul>
        <div class="ka-feedback-entries"></div>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    this.feedback.renderFeedbackEntries(document.querySelector('.ka-feedback-entries'));

    let detailsContent = document.querySelector('.ka-dialog-contents');
    LikeButtonUtils.addUpdateListener(detailsContent);
    detailsContent.querySelector('.ka-like').onclick = LikeButtonUtils.onClickListener;

    this.$overlay = document.querySelector('.ka-overlay');
    this.show();
    return this;
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

  show() {
    // delay the show so that the transition can kick in
    transitionFrom(this.$overlay, 'ka-hidden');
  }

  hide() {
    const $overlay = this.$overlay;
    transitionTo($overlay, 'ka-hidden').then(() => $overlay.parentNode.removeChild($overlay))
  }


};
