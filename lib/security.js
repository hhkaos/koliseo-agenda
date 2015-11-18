import hello from 'hellojs';

const HOSTNAME = location.hostname == 'localhost'? 'http://localhost:8888/' : 'https://www.koliseo.com/';

hello.init({

  koliseo: {

    name: 'Koliseo',

    oauth: {
      version: 2,
      auth: HOSTNAME + 'login/auth',
      grant: HOSTNAME + 'login/auth/token',
      redirect_uri: window.location.href.split('#')[0],
      display: 'page',
    },

    scope: {
      basic: 'events.edit'
    },

    // API base URI
    base: HOSTNAME,

    // Map GET requests
    get: {
      me: 'users/current',
    },

    // Map POST requests
    post: {
    },

    // Map PUT requests
    put: {
    },

    // Map DELETE requests
    del: {
    },

    xhr: function(p) {
      var token = p.query.access_token;
      delete p.query.access_token;
      if (token) {
        p.headers = {
            "Authorization": "Bearer " + token,
        };
      }
      return true;
    }

  }
}, {
  display: 'page',
  default_service: 'koliseo'
});

let currentUser;

class Security {

  constructor() {

    hello.on('auth.login', (auth) => {
      hello(auth.network).api('me').then((user) => {
        currentUser = user;
        hello.emit('koliseo.login');
      });
    });

    hello.on('auth.logout', (r) => {
      currentUser = undefined;
      hello.emit('koliseo.logout');
    });

  }

  on(eventName, callback) {
    hello.on(eventName, callback);
  }

  off(eventName, callback) {
    hello.off(eventName, callback);
  }

  get currentUser() {
    return currentUser;
  }

  login() {
    hello.login();
  }

  logout() {
    hello.logout();
  }

  api: hello.api

}

export { Security };
