import jsdom from 'jsdom';
import assert from 'assert';
import fsp from 'fs-promise';
import path from 'path';
import AgendaView from '../src/AgendaView';
import fetchMock from 'fetch-mock';
import 'mock-local-storage';
import KoliseoAPI from '../src/KoliseoAPI';

describe('AgendaView', () => {

  const doc = jsdom.jsdom('<html><body></body></html>', {
    // history in jsdoc requires a valid URL
    url: 'https://example.com/foo'
  });
  global.document = doc;
  global.window = doc.defaultView;
  global.location = window.location;

  let element;

  function mount() {
    return Promise.all([
      fsp.readFile(path.resolve('test/json/c4p.json')),
      fsp.readFile(path.resolve('test/json/talks.json'))
    ]).then(([c4pContents, agendaContents]) => {
      return [JSON.parse(c4pContents), JSON.parse(agendaContents)]
    }).then(([c4p, agenda]) => {
      return new AgendaView({
        c4p: c4p,
        agenda: agenda,
        element: element
      }).render();
    });
  }

  beforeEach(() => {
    // create the element for the test
    element = document.createElement('div');
    document.body.appendChild(element);

    // the user for this test
    fetchMock.get(/me/, {
      name: "User John Doe"
    });
    fetchMock.get(/likes/, [5701657165824000, 5760220017983488]);

    localStorage.setItem('ka-token', JSON.stringify({
      access_token: 'foobar',
      expires_in: new Date().getTime() + 1000000
    }));
    return KoliseoAPI.init({ c4pUrl: '/foo/bar', oauthClientId: 'foobar' });
    
  });

  it('renders correctly', () => {
    return mount();
  })


});
