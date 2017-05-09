import alt from '../alt';
import KoliseoAPI from '../controller/KoliseoAPI';
import User from '../model/User';

const UserActions = {

  login() {
    return KoliseoAPI.login();
  },

  // load the current user and their likes
  load() {
    return Promise.all([
      KoliseoAPI.getCurrentUser(), KoliseoAPI.getCurrentUserLikes()
    ]).then(([user, likes]) => {
      const readOnly = !KoliseoAPI.oauthClientId;
      return new User(Object.assign({
        likes, readOnly
      }, user));
    }).catch((e) => {
      if (e.status == 401 || e.status == 403) {
        // not logged in, empty User
        return new User({
          likes: [], readOnly
        });
      }
      throw e;
    })

  }

}

export default alt.createActions('UserActions', UserActions);
