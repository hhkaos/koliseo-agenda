import { formatMarkdown } from './stringutils';
import { strToEl } from './util';

class TalkDetailsPopup {

  constructor({ talk, tagColors }) {
    this.talk = talk;
    this.tagColors = tagColors;
  }

  render() {

    const talk = this.talk;
    const html = `
      <div class="ka-talk-details-window">
        <a class="ka-close" title="close"></a>
        <div class="ka-talk-details-viewport">
          <div class="ka-talk-details-inner">
            <div class="ka-talk-details-contents">
              <h2 class="ka-talk-details-title">${talk.title}</h2>
              <div class="ka-talk-details-description">${formatMarkdown(talk.description)}</div>
              ${this.renderTags(talk.tags)}
            </div>
            <ul class="ka-avatars">
              ${talk.authors.map(this.renderAuthor).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    document.querySelector('.ka-overlay').classList.remove('ka-hidden');

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

  renderAuthor({ id, uuid, name, avatar, description }) {
    return `
      <li class="ka-avatar-li ka-avatar-and-text">
        <a href="https://www.koliseo.com/${uuid}" class="ka-avatar-container">
          <span style="display:table-row">
            <img class="ka-avatar-img" src="${avatar}">
            <span class="ka-author-name">${name}</a>
          </span>
        </a>
        <div class="ka-author-data">
          <div class="ka-author-description">${formatMarkdown(description)}</div>
        </div>
      </li>
    `
  }


};

export { TalkDetailsPopup };
