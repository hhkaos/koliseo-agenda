/**
 * The Controller takes care of handling all mouse and form events
 */
export class AgendaController {

  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  /*

  onClickListener(e) {
    e.preventDefault();
    let target = e.target;
    // assert it is a like button
    if (target.classList.contains('ka-like')) {
      if (KoliseoAPI.currentUser) {
        let talk = +target.dataset.talk;
        if (!likesCollection.isSelected(talk)) {
          KoliseoAPI.addLike(talk);
        } else {
          KoliseoAPI.removeLike(talk);
        }
      } else {
        KoliseoAPI.login();
      }
    }
  },




    KoliseoAPI.on('login', () => {
      KoliseoAPI.getCurrentUserLikes().then((likes) => {
        this.likes = likes;
        KoliseoAPI.emit('likes.update');
      })
    });
    KoliseoAPI.on('logout', () => {
      this.likes = [];
      KoliseoAPI.emit('likes.update');
    });
    KoliseoAPI.on('likes.add', (talkId) => {
      if (!this.isSelected(talkId)) {
        this.likes.push(talkId);
        KoliseoAPI.emit('likes.update', talkId);
      }
    });
    KoliseoAPI.on('likes.remove', (talkId) => {
      let index = this.likes.indexOf(talkId);
      if (index !== -1) {
        this.likes.splice(index, 1);
        KoliseoAPI.emit('likes.update', talkId);
      }
    });

class LikesCollection {

  constructor() {
    // id of the talks to mark as selected
    this.likes = [];
  }

  isSelected(talkId) {
    return this.likes.indexOf(talkId) !== -1;
  }

  onUpdate(callback) {
    //    KoliseoAPI.on('likes.update', callback);
  }

}

import likesCollection from './likesCollection';
import KoliseoAPI from './KoliseoAPI';

let getConfig = function(talkId) {
  return likesCollection.isSelected(talkId)? {
    state: 'selected',
    text: "I am planning to attend this talk"
  } : {
    state: 'default',
    text: "Click to mark this talk as favorite"
  };
}

let LikeButtonUtils = {

  renderButton(talkId) {
    let config = getConfig(talkId);
    return KoliseoAPI.readOnly? '' : `
      <span class="ka-like-container">
        <a class="ka-like icon-heart"
            title="${config.text}"
            data-talk="${talkId}"
            data-state="${config.state}">
        </a>
      </span>
    `;
  },

  update(item) {
    let talk = +item.dataset.talk;
    let config = getConfig(talk);
    item.dataset.state = config.state;
    item.title = config.text;
  },

  addUpdateListener(element) {
    likesCollection.onUpdate((talk) => {
      let selector = !talk? '.ka-like' : `.ka-like[data-talk="${talk}"]`;
      let items = element.querySelectorAll(selector);
      if (items.forEach) {
        items.forEach(this.update);
      } else {
        Array.forEach(items, this.update);
      }
    });
  }

}

export default LikeButtonUtils;

*/

}