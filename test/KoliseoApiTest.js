import assert from 'assert';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import jsdom from 'jsdom';
import 'mock-local-storage';
import { getUrlParameter } from '../src/util';

import KoliseoAPI from '../src/controller/KoliseoAPI';

const URL = 'https://example.com/foo'

// init fake credentials in localStorage and return a Promise initializing KoliseoAPI 
function withFakeCredentials({ 
  access_token = 'foobar', 
  expires_in = new Date().getTime() + 1000000
} = {}) {
  localStorage.setItem('ka-token', JSON.stringify({ access_token, expires_in }));
  const { c4pUrl, oauthClientId } = KoliseoAPI;
  KoliseoAPI.init({ c4pUrl, oauthClientId });
  return Promise.resolve();
}

describe('KoliseoAPI', () => {

  beforeEach(() => {
    // URL manipulation in jsdoc requires a valid URL
    const doc = jsdom.jsdom('<html><body></body></html>', {
      url: URL
    });
    global.document = doc;
    global.window = doc.defaultView;
    global.location = window.location;

    global.alert = sinon.spy();

    return KoliseoAPI.init({
      c4pUrl: '/foobar',
      oauthClientId: 'MY-CLIENT-ID'
    });
  });

  afterEach(() => {
    localStorage.removeItem('ka-state');
    localStorage.removeItem('ka-token');
  })

  it('logs in, does something, logs out', () => {
    fetchMock.get(/me/, () => {
      return {
        id: 1,
        name: "User John Doe"
      };
    });
    const onLogoutListener = sinon.spy();
    KoliseoAPI.navigate=sinon.spy(KoliseoAPI.navigate); 
    return withFakeCredentials().then(() => {
      KoliseoAPI.login();
      const redirectedUrl = KoliseoAPI.navigate.args[0][0];
      assert(redirectedUrl.startsWith('https://www.koliseo.com/login/auth?client_id=MY-CLIENT-ID&response_type=token&redirect_uri=https%3A%2F%2Fexample.com%2Ffoo%3FoauthCallback&scope=talks.feedback&state='));
      location.href = `${URL}?state=${localStorage.getItem('ka-state')}&access_token=foo&expires_in=${new Date().getTime() + 1000000 }`;
      const state = getUrlParameter(redirectedUrl, 'state');
      window.history.pushState({}, "after login", URL + `?state=${state}&access_token=barbaz&expires_in=${new Date().getTime() + 1000000}`);
      KoliseoAPI.init({
        c4pUrl: KoliseoAPI.c4pUrl,
        oauthClientId: KoliseoAPI.oauthClientId
      });
      return KoliseoAPI.getCurrentUser();
    }).then((currentUser) => {
      assert(localStorage.getItem('ka-token'));
      assert(!localStorage.getItem('ka-state'));
      assert.equal('User John Doe', currentUser.name);
      KoliseoAPI.onLogout(onLogoutListener);
      KoliseoAPI.logout();
    }).then(() => {
      assert(onLogoutListener.calledOnce);
      assert(!KoliseoAPI.token);
      assert(!localStorage.getItem('ka-token'));
      assert(!localStorage.getItem('ka-state'));
    })
  });

  it('logs out automatically when credentials have expired', () => {
    fetchMock.post(/agenda\/likes/, (args, request) => {
      assert.equal('Bearer foobar', request.headers.Authorization);
      return {
        status: 401
      };
    });
    const onLogoutListener = sinon.spy();

    KoliseoAPI.onLogout(onLogoutListener);
    return withFakeCredentials({ expires_in: 100 }).then(() => {
      KoliseoAPI.onLogout(onLogoutListener);
      return KoliseoAPI.addLike(5);
    }).then(() => {
      assert.fail('Operation should not have succeeded')
    }).catch((e) => {
      assert(alert.calledOnce);
      assert.equal(401, e.status);
      assert.equal('Error contacting the Koliseo server: 401', e.message);
      assert(onLogoutListener.calledOnce);
    })
  });

});
