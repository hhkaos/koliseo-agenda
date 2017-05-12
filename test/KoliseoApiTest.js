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
  const { urls, oauthClientId } = KoliseoAPI;
  KoliseoAPI.init({ urls: urls, oauthClientId });
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
      urls: { c4p: '/foobar' },
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
    KoliseoAPI.navigate=sinon.spy(KoliseoAPI.navigate); 
    return withFakeCredentials().then(() => {
      KoliseoAPI.login();
      const redirectedUrl = KoliseoAPI.navigate.args[0][0];
      assert(redirectedUrl.startsWith('https://www.koliseo.com/login/auth?client_id=MY-CLIENT-ID&response_type=token&redirect_uri=https%3A%2F%2Fexample.com%2Ffoo%3FoauthCallback&scope=talks.feedback&state='));
      location.href = `${URL}?state=${localStorage.getItem('ka-state')}&access_token=foo&expires_in=${new Date().getTime() + 1000000 }`;
      const state = getUrlParameter(redirectedUrl, 'state');
      window.history.pushState({}, "after login", URL + `?state=${state}&access_token=barbaz&expires_in=${new Date().getTime() + 1000000}`);
      KoliseoAPI.init({
        urls: KoliseoAPI.urls,
        oauthClientId: KoliseoAPI.oauthClientId
      });
      return KoliseoAPI.getCurrentUser();
    }).then((currentUser) => {
      assert(localStorage.getItem('ka-token'));
      assert(!localStorage.getItem('ka-state'));
      assert.equal('User John Doe', currentUser.name);
      KoliseoAPI.logout();
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

    return withFakeCredentials({ expires_in: 100 }).then(() => {
      return KoliseoAPI.addLike(5);
    }).then(() => {
      assert.fail('Operation should not have succeeded')
    }).catch((e) => {
      assert(alert.calledOnce);
      assert.equal(401, e.status);
      assert.equal('Error contacting koliseo.com: 401', e.message);
      assert(!KoliseoAPI.token);
    })
  });

});
