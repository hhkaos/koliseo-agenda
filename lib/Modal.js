import { strToEl, transitionFrom, transitionTo, debug } from './util.js';

class Modal {

  constructor() {
    const body = document.body;
    this.background = strToEl('<div class="kagenda-modal-background hidden"></div>');
    this.modal = strToEl('<div class="kagenda-modal-window hidden to-circle"></div>')
    body.appendChild(this.modal);
    body.appendChild(this.background);
    body.addEventListener('click', this.onClick.bind(this));
  }

  render({ id, start, end, type, contents }) {

    this.modal.innerHTML =
`
<button class="kagenda-close">Close</button>
<h2 class="kagenda-modal-title">${contents.title}</h2>
<div class="kagenda-modal-description">${contents.description}</div>
${this.renderTags(contents.tags)}
<ul class="kagenda-footer-authors">
${contents.authors.map(this.renderFooterAuthor).join('')}
</ul>
`
  }

  // Grow from the center of the boundingRect passed as argument
  animateGrow(rect) {
    this.modal.innerHTML = '';
    const circleRadius = 5;

    this.setModalPosition(rect.left + (rect.width / 2) - 5, rect.top + (rect.height / 2) - 5);

    requestAnimationFrame(_ => {
      this.background.classList.remove('hidden');
      this.modal.classList.remove('hidden');
      this.modal.classList.remove('to-circle');
      this.setModalPosition()
    });

  }

  renderTags(tags){
    if (!tags) {
      return '';
    }
    return Object.keys(tags).map(category => {
      return tags[category].map(tag => `<span class="label radius tag">${tag}</span>`).join(' ')
    }).join(' ')
  }

  renderHeaderAuthor({ id, uuid, name, avatar, description }) {
    return (
`
<li class="kagenda-header-author">
<a href="https://www.koliseo.com/${uuid}" class="kagenda-author" title="${name}">
<img class="kagenda-avatar" src="${avatar}">
</a>
</li>
`
    )
  }

  renderFooterAuthor({ id, uuid, name, avatar, description }) {
    return (
`
<li class="kagenda-footer-author">
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

  setModalPosition(left, top) {
    function topx(value) {
      return typeof value === 'undefined'? '' : (Math.round(value) + 'px');
    }
    const style = this.modal.style;
    style.left = topx(left);
    style.top = topx(top);
  }

  close() {
    this.background.classList.add('hidden');
    this.modal.classList.add('hidden');
    this.modal.classList.add('to-circle');

    // todo
    this.trigger('closed');
  }

  onClick(event) {
    const target = event.target;
    const classlist = target && target.classList;
    if (classlist) {
      if (classlist.contains('kagenda-modal-background') || classlist.contains('kagenda-close')) {
        this.close();
      }
    }
  }

};

export { Modal };
