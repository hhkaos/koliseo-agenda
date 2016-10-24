import hello from 'hellojs';

const HOSTNAME = location.hostname == 'localhost'? 'http://localhost:8888/' : 'https://www.koliseo.com/';

let defaultErrorHandler = function(e, successCallback) {
  if (e && e.error) {
    // check some UC that hellojs see as errors and we do not
    if ("empty_response" === e.error.code) {
      successCallback && successCallback(undefined);
    }
    // usually this is because of an invalid token or an expired token
    if ("access_denied" === e.error.code) {
      hello.logout();
      return false;
    }
  }
  return e;
}

class KoliseoAPI {

  constructor() {

    hello.on('auth.login', (auth) => {
      hello(auth.network).api('me').then((user) => {
        this.currentUser = user;
        hello.emit('login');
      }, defaultErrorHandler);
    });

    hello.on('auth.logout', (r) => {
      this.currentUser = undefined;
      hello.emit('logout');
    });

  }

  init({baseUrl = HOSTNAME, c4pUrl, oauthClientId}) {
    this.c4pUrl = c4pUrl;
    this.oauthClientId = oauthClientId;

    if (oauthClientId) {
      hello.init({ koliseo: oauthClientId });
    } else {
      console.warn('Some features have been disabled because oauthClientId has not been declared');
    }

    hello.init({

      koliseo: {

        name: 'Koliseo',

        oauth: {
          version: 2,
          auth: baseUrl + 'login/auth',
          grant: baseUrl + 'login/auth/token',
          redirect_uri: window.location.href.split('#')[0]
        },

        scope: {
          basic: 'talks.feedback'
        },

        // API base URI
        base: baseUrl,

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
          p.headers = p.headers || {};
          if (token) {
            p.headers["Authorization"] = "Bearer " + token
          }
          p.headers['Content-Type'] = 'application/json';
          p.headers['Accept'] = 'application/json';
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
  }

  on(eventName, callback) {
    hello.on(eventName, callback);
  }

  off(eventName, callback) {
    hello.off(eventName, callback);
  }

  emit(eventName, value) {
    hello.emit(eventName, value);
  }

  isOAuthConfigured() {
    return !!this.oauthClientId;
  }

  login(e) {
    e && e.preventDefault();
    hello.login();
  }

  logout(e) {
    e && e.preventDefault();
    hello.logout();
  }

  sendFeedback({id, rating, comment}, callback) {
    hello.api(this.c4pUrl + '/proposals/@{id}/feedback', 'post', { id: id, rating, comment}).then(callback, (error) => {
      defaultErrorHandler(error, callback);
    });
  }

  getFeedbackEntries(id, cursor, callback) {
    let successCallback = (resp) => {
      callback(resp.data);
      if (resp.cursor) {
        this.getFeedbackEntries(id, resp.cursor, callback);
      }
    }.bind(this);
    hello.api(`${this.c4pUrl}/proposals/${id}/feedback?${cursor? 'cursor=' + cursor : ''}`).then(successCallback, (error) => {
      defaultErrorHandler(error, callback);
    });
  }

  getCurrentUserLikes() {
    return hello.api(`${this.c4pUrl}/agenda/likes`);
  }

  addLike(talkId) {
    return hello.api(`${this.c4pUrl}/agenda/likes/${talkId}`, 'post').then(() => {
      hello.emit('likes.add', talkId);
    });
  }

  removeLike(talkId) {
    return hello.api(`${this.c4pUrl}/agenda/likes/${talkId}`, 'delete').then(() => {
      hello.emit('likes.remove', talkId);
    });
  }

  getCurrentUserFeedbackEntry({id}, callback) {
    hello.api(this.c4pUrl + '/proposals/@{id}/feedback/@{entryId}', 'get', { id: id, entryId: this.currentUser.id + '-' + id }).then(callback, (error) => {
      defaultErrorHandler(error, callback);
    })
  }

}

export default new KoliseoAPI();
