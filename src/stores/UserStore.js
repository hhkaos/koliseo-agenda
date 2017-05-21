import alt from '../alt';
import Store from 'alt-ng/Store';
import UserActions from '../actions/UserActions';
import User from '../model/User';

class UserStore extends Store {

  constructor() {
    super();
    this.state = {
      // Current user
      // currentUser
    }
    this.bindActions(UserActions);
  }

  load(currentUser) {
    this.setState({
      currentUser
    })
  }

  logout(ANONYMOUS) {
    this.setState({
      currentUser: ANONYMOUS
    })
  }

}
export default alt.createStore('UserStore', new UserStore());
