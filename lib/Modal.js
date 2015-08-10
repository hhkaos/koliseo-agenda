import { strToEl, transitionFrom, transitionTo, closest, debug } from './util.js';

class Modal {

  constructor() {
    this.background = strToEl('<div class="kagenda-modal-background hidden"></div>');
    this.modal = strToEl('<div class="kagenda-modal-window hidden to-circle"></div>')
    document.body.appendChild(this.modal);
    document.body.appendChild(this.background);
  }

  render(talk) {
    const $a = document.querySelector(`.kagenda-talk-title[data-hash="${talk.contents.hash}"]`);
    const $cellContent = closest($a, '.kagenda-cell-contents')

    debug(talk);

    transitionTo($cellContent, 'to-circle')
    .then(() => {

      debug(2);

      const rect = $cellContent.getBoundingClientRect();
      this.setRect(rect);

      this.background.classList.remove('hidden');
      transitionFrom(this.modal, 'hidden')
        .then(() => {

          debug(3);
          transitionFrom(this.modal, 'to-circle');
          this.setRect({});
        });

    })
  }

  setRect(rect) {
    function topx(value) {
      return typeof value === 'undefined'? '' : (Math.round(value) + 'px');
    }
    const style = this.modal.style;
    style.left = topx(rect.left);
    style.right = topx(rect.right);
    style.top = topx(rect.top);
    style.bottom = topx(rect.bottom);
  }

  close() {

  }

};

export { Modal };
