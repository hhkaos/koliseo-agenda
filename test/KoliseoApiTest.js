import assert from 'assert';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import jsdom from 'jsdom';
import 'mock-local-storage';

import KoliseoAPI from '../src/KoliseoAPI';

const URL = 'https://example.com/foo'

// init fake credentials in localStorage and return a Promise initializing KoliseoAPI 
function withFakeCredentials({ 
  access_token = 'foobar', 
  expires_in = new Date().getTime() + 1000000
} = {}) {
  localStorage.setItem('ka-token', JSON.stringify({ access_token, expires_in }));
  const { c4pUrl, oauthClientId } = KoliseoAPI;
  return KoliseoAPI.init({ c4pUrl, oauthClientId });
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
    return api.login().then(() => {
      assert.equal('kk', location.href);
      location.href = `${URL}?state=${localStorage.getItem('ka-state')}&access_token=foo&expires_in=${new Date().getTime() + 1000000 }`;
      return api.init();
    }).then((currentUser) => {
      assert.equal('kk', JSON.stringify(currentUser));
      KoliseoAPI.onLogout(onLogoutListener);
      assert.fail();
    }).then(() => {
      KoliseoAPI.logout();
      assert(onLogout.callendOnce());
    })
  });

  it('checks state while logging in', () => {
    assert.fail('todo');
  });

  it('logs out automatically when credentials have expired', () => {
    fetchMock.post(/agenda\/likes/, (args, request) => {
      assert.equal('Bearer foobar', request.headers.Authorization);
      return {
        // todo: use a real value
        name: "User John Doe"
      };
    });
    const onLogoutListener = sinon.spy();

    KoliseoAPI.onLogout(onLogoutListener);
    return withFakeCredentials({ expires_in: 100 }).then(() => {
      return KoliseoAPI.addLike(5);
    }).then(() => {
      assert.fail('Operation should not have succeeded')
    }).catch((e) => {
      assert.equal('kk', e.message);
      assert.equal(401, e.status);
      assert(onLogoutListener.calledOnce);
    })
  });

  it('addLike', () => {
    fetchMock.post(/agenda\/likes/, (args, request) => {
      assert.equal('Bearer foobar', request.headers.Authorization);
      return {
        // todo: use a real value
        name: "User John Doe"
      };
    });
    return withFakeCredentials().then(() => {
      return KoliseoAPI.addLike({ talkId: 5 })
    }).then((user) => {
      assert.equal('User John Doe', user.name);
    })
  })

});
