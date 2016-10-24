import KoliseoAPI from './KoliseoAPI';

class LikesCollection {

  constructor() {
    // id of the talks to mark as selected
    this.likes = [];

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

  }

  isSelected(talkId) {
    return this.likes.indexOf(talkId) !== -1;
  }

  onUpdate(callback) {
    KoliseoAPI.on('likes.update', callback);
  }

}

export default new LikesCollection();
