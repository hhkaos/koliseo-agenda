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
    return !KoliseoAPI.isOAuthConfigured()? '' : `
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
