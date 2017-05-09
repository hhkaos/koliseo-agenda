import alt from '../alt';

const UserActions = {

  login() {
    return KoliseoAPI.login();
  }

}

export default alt.createActions('UserActions', UserActions);
