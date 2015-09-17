import { formatMarkdown } from './stringutils';

class TalkDetailsRow {

  constructor(talk) {
    this.talk = talk;
  }

  render(columns) {
    const talk = this.talk;
    const $td = document.createElement('td');
    $td.className = 'kagenda-talk-details-td';
    $td.setAttribute('colspan', columns);
    $td.innerHTML = (
`
  <h2 class="kagenda-zoom-title">${talk.title}</h2>
  <div class="kagenda-zoom-description">${formatMarkdown(talk.description)}</div>
  ${this.renderTags(talk.tags)}
  <ul class="kagenda-footer-authors">
  ${talk.authors.map(this.renderAuthor).join('')}
  </ul>
`
    )

    const $tr = document.createElement('tr');
    $tr.className = 'kagenda-talk-details';
    $tr.appendChild($td);
    return $tr;
  }

  renderTags(){
    const tags = this.talk.tags;
    if (!tags) {
      return '';
    }
    return Object.keys(tags).map(category => {
      return tags[category].map(tag => `<span class="label radius tag">${tag}</span>`).join(' ')
    }).join(' ')
  }

  renderAuthor({ id, uuid, name, avatar, description }) {
    return (
`
<li class="kagenda-author">
<a href="https://www.koliseo.com/${uuid}" class="kagenda-author">
<img class="kagenda-avatar" src="${avatar}">
</a>
<div class="kagenda-author-data">
<a href="https://www.koliseo.com/${uuid}">${name}</a>
<p class="kagenda-author-description">${description}
</div>
</li>
`
    )
  }


};

export { TalkDetailsRow };
