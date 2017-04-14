
// generate a random identifier
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function assert(assertion, message) {
  if (!assertion) {
    throw new Error(message);
  }
}


// return the GET parameter from a URL 
// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getUrlParameter(url, name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(url);
  return !results ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// extract the access token from the URL, validating state if necessary
// also saves the token in localStorage
function getTokenFromUrl() {
  const access_token = getUrlParameter('access_token');
  const expires_in = getUrlParameter('expires_in');
  debugger;
  if (access_token && expires_in) { 
    const state = localStorage.getItem('ka-state');
    if (state == getUrlParameter('state')) {
      const result = { access_token, expires_in };
      localStorage.setItem('ka-token', result);
      localStorage.removeItem('ka-state');
      return result;
    }
  }
    return undefined;
}

const URL = 'https://www.koliseo.com';

/**
 * this.c4pUrl: (required) the URL to talk to
 * this.token: (optional) the oauth token
 * this.currentUser: (optional)the currently logged in user
 * this.oauthClientId: (optional) The Koliseo clientID of this application
 * this.readOnly: true if there is no oauthClientID configured (write operations are disabled)
 * 
 * Stores in localStorage:
 * ka-state: (optional) state sent to OAuth identity provider
 * ka-token: (optional) { expires_in, access_token } OAuth token to be used
 */
class KoliseoAPI {

  // initializes the parameters to communicate to the server
  // returns a Promise that returns the current user
  init({ c4pUrl, oauthClientId }) {
    assert(c4pUrl, 'Missing c4pUrl');
    this.c4pUrl = c4pUrl;
    this.oauthClientId = oauthClientId;
    this.token = getTokenFromUrl() || localStorage.getItem('ka-token');
    this.readOnly = !oauthClientId;
    this.logoutListeners = [];
    return this.getCurrentUser();
  }

  getCurrentUser() {
    return !this.token || this.token.expires_in < new Date().getTime()? Promise.resolve() : this.fetch({
      endpoint: '/me'
    }).then((user) => {
      this.currentUser = user;
      return user;
    });
  }

  fetch({ endpoint, method = 'get', body }) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers.Authorization = "Bearer " + this.token.access_token
    }

    body = body ? JSON.stringify(body) : undefined;
    return fetch(URL + endpoint, {
      method, headers, body, credentials: 'same-origin'
    }).then(function (response) {
      // if the response is not 2xx, throw error message 
      if (!response.ok) {
        const error = new Error('Error contacting the Koliseo server: ' + response.status);
        error.status = response.status;
        throw error;
      }

      // else forward the JSON object
      return response.json();
    }).catch((error) => {
      // credentials have expired. Re-draw component
      if (error.status == 401 || error.status == 403) {
        alert("Your credentials have expired. Please, log in again")
        this.logout();
      }
      throw error;
    });
  }

  login() {
    assert(this.oauthClientId, 'Missing oauthClientUrl');
    const state = uuid();
    localStorage.setItem('ka-state', state);
    let redirect_uri = location.href.split('#')[0];
    redirect_uri = encodeURIComponent(redirect_uri + (redirect_uri.indexOf('?') == -1? '?' : '&') + 'oauthCallback');
    location.href=`${URL}/login/auth?client_id=${this.oauthClientId}&response_type=token&redirect_uri=${redirect_uri}&scope=talks.feedback&state=${state}`
  }

  onLogout(listener) {
    this.logoutListeners.push(listener);
  }

  // logs out. Can be triggered by any method if the credentials have expired
  logout() {
    this.currentUser = this.token = undefined;
    this.logoutListeners.each(l => l());
  }

  sendFeedback({ id, rating, comment }) {
    return this.fetch({
      method: 'post', 
      url: `${this.c4pUrl}/proposals/${id}/feedback`, 
      body: { id, rating, comment }
    });
  }

  getFeedbackEntries({ id, cursor }) {
    todo('process with cursor, also create tests')
    return this.fetch({
      url: `${this.c4pUrl}/proposals/${id}/feedback?${cursor ? 'cursor=' + cursor : ''}`
    })
  }

  getCurrentUserLikes() {
    return this.fetch({ 
      url: `${this.c4pUrl}/agenda/likes`
    });
  }

  addLike({ talkId }) {
    return this.fetch({
      url: `${this.c4pUrl}/agenda/likes/${talkId}`, 
      method: 'post'
    });
  }

  removeLike({ talkId }) {
    return this.fetch({
      url: `${this.c4pUrl}/agenda/likes/${talkId}`, 
      method: 'delete'
    });
  }

  getCurrentUserFeedbackEntry({ id }) {
    const entryId = this.currentUser.id + '-' + id;
    return this.fetch({
      url: this.c4pUrl + '/proposals/${id}/feedback/${entryId}'
    })
  }

}

export default new KoliseoAPI();