import alt from '../alt';
import KoliseoAPI from '../controller/KoliseoAPI';
import User from '../model/User';

let ANONYMOUS;

const UserActions = {

  login() {
    return KoliseoAPI.login();
  },

  logout() {
    KoliseoAPI.logout();
    return ANONYMOUS;
  },

  // load the current user and their likes
  load() {
    const readOnly = !KoliseoAPI.oauthClientId;
    ANONYMOUS = new User({
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
