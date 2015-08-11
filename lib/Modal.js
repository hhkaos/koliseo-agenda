import { strToEl, transitionFrom, transitionTo, closest, debug } from './util.js';

class Modal {

  constructor() {
    const body = document.body;
    this.background = strToEl('<div class="kagenda-modal-background hidden"></div>');
    this.modal = strToEl('<div class="kagenda-modal-window hidden to-circle"></div>')
    body.appendChild(this.modal);
    body.appendChild(this.background);
    body.addEventListener('click', this.onClick.bind(this));
  }

  render(talk) {

    this.modal.innerHTML =
`
<div class="kagenda-close"></div>
`
    this.animate(talk);
  }

  animate(talk) {
    const $a = document.querySelector(`.kagenda-talk-title[data-hash="${talk.contents.hash}"]`);
    const $cellContent = this.$cellContent = closest($a, '.kagenda-cell-contents');
    $cellContent.classList.add('selected')
    setTimeout(() => {
      const rect = $cellContent.getBoundingClientRect();
      this.setRect(rect);

      requestAnimationFrame(_ => {
        this.background.classList.remove('hidden');
        this.modal.classList.remove('hidden');
        this.modal.classList.remove('to-circle');
        this.setRect({})
      });
    }, 500);

  }

  setRect(rect) {
    function topx(value) {
      return typeof value === 'undefined'? '' : (Math.round(value) + 'px');
    }
    const style = this.modal.style;
    style.left = topx(rect.left);
    style.top = topx(rect.top);
    style.width = topx(rect.width);
    style.height = topx(rect.height);
  }

  close() {
    this.background.classList.add('hidden');
    this.modal.classList.add('hidden');
    this.modal.classList.add('to-circle');

    this.$cellContent.classList.remove('selected')
    this.$cellContent = undefined;

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
