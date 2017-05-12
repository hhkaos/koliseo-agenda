import alt from '../alt';
import KoliseoAPI from '../controller/KoliseoAPI';
import User from '../model/User';

const UserActions = {

  login() {
    return KoliseoAPI.login();
  },

  // load the current user and their likes
  load() {
    const readOnly = !KoliseoAPI.oauthClientId;
    const ANONYMOUS = new User({
      likes: [], readOnly
    });
    
    if (!KoliseoAPI.token) {
      return Promise.resolve(ANONYMOUS);
    } 

    return Promise.all([
      KoliseoAPI.getCurrentUser(), KoliseoAPI.getCurrentUserLikes()
    ]).then(([user, likes]) => {
      return new User(Object.assign({
        likes, readOnly
      }, user));
    }).catch((e) => {
      if (e.status == 401 || e.status == 403) {
        // not logged in, empty User
        return ANONYMOUS;
      }
      throw e;
    })

  }

}

export default alt.createActions('UserActions', UserActions);
