import { formatMarkdown } from './stringutils';

class TalkDetailsRow {

  constructor({ talk, tagColors }) {
    this.talk = talk;
    this.tagColors = tagColors;
  }

  render(columns) {
    const talk = this.talk;
    const $td = document.createElement('td');
    $td.className = 'kagenda-talk-details-td';
    $td.setAttribute('colspan', columns);
    $td.innerHTML = `
      <div class="kagenda-talk-details-contents">
        <h2 class="kagenda-talk-details-title">${talk.title}</h2>
        <div class="kagenda-talk-details-description">${formatMarkdown(talk.description)}</div>
        ${this.renderTags(talk.tags)}
      </div>
      <ul class="kagenda-avatars">
        ${talk.authors.map(this.renderAuthor).join('')}
      </ul>
    `

    const $tr = document.createElement('tr');
    $tr.className = 'kagenda-talk-details';
    $tr.appendChild($td);
    return $tr;
  }

  renderTags() {
    const tags = this.talk.tags;
    if (!tags) {
      return '';
    }
    return '<div class="kagenda-tags">' +
      Object.keys(tags).map(category => {
        return tags[category].map(tag => `<span class="tag tag${this.tagColors[category]}">${tag}</span>`).join(' ')
      }).join(' ') +
      '</div>'
  }

  renderAuthor({ id, uuid, name, avatar, description }) {
    return `
      <li class="kagenda-avatar-li kagenda-avatar-and-text">
        <a href="https://www.koliseo.com/${uuid}" class="avatar">
        <img class="kagenda-avatar" src="${avatar}">
        </a>
        <div class="kagenda-author-data">
          <a class="kagenda-author-name" href="https://www.koliseo.com/${uuid}">${name}</a>
          <div class="kagenda-author-description">${formatMarkdown(description)}</div>
        </div>
      </li>
    `
  }


};

export { TalkDetailsRow };
