import hello from 'hellojs';

const HOSTNAME = location.hostname == 'localhost'? 'http://localhost:8888/' : 'https://www.koliseo.com/';

hello.init({

  koliseo: {

    name: 'Koliseo',

    oauth: {
      version: 2,
      auth: HOSTNAME + 'login/auth',
      grant: HOSTNAME + 'login/auth/token',
      redirect_uri: window.location.href.split('#')[0]
    },

    scope: {
      basic: 'talks.feedback'
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
      p.headers['content-type'] = 'application/json';
      if (p.method === 'post' || p.method === 'put') {
        p.data = JSON.stringify(p.data);
      }
      return true;
    }

  }
}, {
  display: 'page',
  default_service: 'koliseo',
  force: false
});

let currentUser;

class Security {

  constructor({c4pUrl}) {

    this.c4pUrl = c4pUrl;

    hello.on('auth.login', (auth) => {
      hello(auth.network).api('me').then((user) => {
        currentUser = user;
        hello.emit('koliseo.login');
        console.log('WTFFFF')
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

  sendFeedback({id, rating, comment}, callback) {
    hello.api(this.c4pUrl + '/proposals/@{id}/feedback', 'post', { id: id, rating, comment}, callback);
  }

  getFeedbackEntries(id, cursor, callback) {
    hello.api(`${this.c4pUrl}/proposals/${id}/feedback?${cursor? 'cursor=' + cursor : ''}`, 'get', (resp) => {
      callback(resp.data);
      if (resp.cursor) {
        this.getFeedbackEntries(id, resp.cursor, callback);
      }
    }.bind(this));
  }

  getCurrentUserFeedbackEntry({id}, callback) {
    hello.api(this.c4pUrl + '/proposals/@{id}/feedback/@{entryId}', 'get', { id: id, entryId: currentUser.id + '-' + id }, callback);
  }

}

export { Security };
