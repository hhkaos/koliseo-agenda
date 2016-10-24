import likesCollection from './likesCollection';
import KoliseoAPI from './KoliseoAPI';

let getConfig = function(talkId) {
  return !KoliseoAPI.currentUser? {
    state: 'hidden',
    text: '',
  } : likesCollection.isSelected(talkId)? {
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
    return `
      <span class="ka-like-container">
        <a class="ka-like icon-heart"
            title="${config.text}"
            data-talk="${talkId}"
            data-state="${config.state}">
        </a>
      </span>
    `;
  },

  onClickListener(e) {
    e.preventDefault();
    let target = e.target;
    // assert it is a like button
    if (target.classList.contains('ka-like')) {
      let talk = +target.dataset.talk;
      if (!likesCollection.isSelected(talk)) {
        KoliseoAPI.addLike(talk);
      } else {
        KoliseoAPI.removeLike(talk);
      }
    }
  },

  update(element) {
    let talk = +element.dataset.talk;
    let config = getConfig(talk);
    element.dataset.state = config.state;
    element.title = config.text;
  },

  addUpdateListener(element) {
    likesCollection.onUpdate((talk) => {
      let selector = !talk? '.ka-like' : `.ka-like[data-talk="${talk}"]`;
      element.querySelectorAll(selector).forEach(this.update);
    });
  }

}

export default LikeButtonUtils;
