import { getUrlParameter } from '../util';

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


// extract the access token from the URL, validating state if necessary
// also saves the token in localStorage
function getTokenFromUrl() {
  const access_token = getUrlParameter(location.href, 'access_token');
  const expires_in = getUrlParameter(location.href, 'expires_in');
  if (access_token && expires_in) { 
    const state = localStorage.getItem('ka-state');
    if (state == getUrlParameter(location.href, 'state')) {
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
 * this.oauthClientId: (optional) The Koliseo clientID of this application
 * 
 * Stores in localStorage:
 * ka-state: (optional) state sent to OAuth identity provider
 * ka-token: (optional) { expires_in, access_token } OAuth token to be used
 */
class KoliseoAPI {

  // initializes the parameters to communicate to the server
  // returns a Promise that returns the current user
  init({ c4pUrl, oauthClientId } = {}) {
    assert(c4pUrl, 'Missing c4pUrl');
    this.c4pUrl = c4pUrl;
    this.oauthClientId = oauthClientId;
    this.token = getTokenFromUrl();
    if (!this.token) {
      const s = localStorage.getItem('ka-token');
      this.token = JSON.parse(s);
    }
  }

  getCurrentUser() {
    return this.fetch({
      url: URL + '/me'
    });
  }

  fetch({ url, method = 'get', body }) {
    const headers = {
      Accept: 'application/json',
      //Mode: 'cors', todo: Not yet supported
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers.Authorization = "Bearer " + this.token.access_token
    }

    body = body ? JSON.stringify(body) : undefined;
    return fetch(url, {
      method, headers, body, credentials: 'same-origin'
    }).then(function (response) {
      // if the response is not 2xx, throw error message 
      if (!response.ok) {
        const error = new Error('Error contacting koliseo.com: ' + response.status);
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
    this.navigate(`${URL}/login/auth?client_id=${this.oauthClientId}&response_type=token&redirect_uri=${redirect_uri}&scope=talks.feedback&state=${state}`);
  }

  // go to the specified URL
  navigate(url) {
    location.href=url;
  }

  // logs out. Can be triggered by any method if the credentials have expired
  logout() {
    this.token = undefined;
    localStorage.removeItem('ka-state');
    localStorage.removeItem('ka-token');
  }

  getC4p() {
    return this.fetch({ url: this.c4pUrl });
  }

  getAgenda() {
    return this.fetch({ url: this.c4pUrl + '/agenda' });
  }

  sendFeedback({ id, rating, comment }) {
    return this.fetch({
      method: 'post', 
      url: `${this.c4pUrl}/proposals/${id}/feedback`, 
      body: { id, rating, comment }
    });
  }

  getFeedbackEntries({ id, cursor }) {
    // todo('process with cursor')
    return this.fetch({
      url: `${this.c4pUrl}/proposals/${id}/feedback?${cursor? 'cursor=' + cursor : ''}`
    })
  }

  getCurrentUserLikes() {
    return this.fetch({ 
      url: `${this.c4pUrl}/agenda/likes`
    }).catch((error) => {
      // anonymous users get here
      // todo: there is a bug on the server side that is returning 500 for anonymous users
      if (error.status == 500) { // 401 || error.status == 403) {
        return [];
      }
      throw error;
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