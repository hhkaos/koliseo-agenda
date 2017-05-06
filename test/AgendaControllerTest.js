import jsdom from 'jsdom';
import assert from 'assert';
import fsp from 'fs-promise';
import path from 'path';
import AgendaController from '../src/controller/AgendaController';
import fetchMock from 'fetch-mock';
import 'mock-local-storage';
import KoliseoAPI from '../src/controller/KoliseoAPI';

describe('AgendaController', () => {

  const URL = 'https://example.com/foo';
  const doc = jsdom.jsdom('<html><body></body></html>', {
    // history in jsdoc requires a valid URL
    url: URL
  });
  global.document = doc;
  global.window = doc.defaultView;
  global.location = window.location;

  let element;

  before(() => {
    fetchMock.get(/me/, {
      id: 5,
      name: "User John Doe"
    });
    fetchMock.get(/likes/, [5701657165824000, 5760220017983488]);
    return Promise.all([
      fsp.readFile(path.resolve('test/json/c4p.json')),
      fsp.readFile(path.resolve('test/json/talks.json'))
    ]).then(([c4pContents, agendaContents]) => {
      fetchMock.get(/agenda/, JSON.parse(agendaContents.toString()));
      fetchMock.get(/c4p/, JSON.parse(c4pContents.toString()));
    })
  })


  function mount({ 
    c4pUrl = URL + '/c4p',
    agendaUrl = URL + '/c4p/agenda',
    oauthClientId = 'foobar'
  } = {}) {
    return new AgendaController({ 
      c4pUrl, agendaUrl, element, oauthClientId
    }).init();
  }

  beforeEach(() => {
    // create the element for the test
    element = document.createElement('div');
    document.body.appendChild(element);

    // the user for this test
    localStorage.setItem('ka-token', JSON.stringify({
      access_token: 'foobar',
      expires_in: new Date().getTime() + 1000000
    }));
  });

  it('renders correctly', () => {
    return mount();
  })


});
