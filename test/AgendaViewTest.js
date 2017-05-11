
import assert from './assertions';
import fsp from 'fs-promise';
import path from 'path';
import renderAgenda from '../src/view/AgendaView';
import KoliseoAPI from '../src/controller/KoliseoAPI';
import fetchMock from 'fetch-mock';
import 'mock-local-storage';
import {URL, initDOM} from './mock/jsdom-init'; 

describe('AgendaView', () => {

  initDOM();
  let element;

  // uncomment to switch to easy mode :)
  // const AGENDA_FILENAME = 'test/json/talks.json';
  const AGENDA_FILENAME = 'test/json/codemotion.json'; 
  const C4P_FILENAME = 'test/json/c4p.json';

  before(() => {
    fetchMock.get(/me/, {
      id: 5,
      name: "User John Doe"
    });
    fetchMock.get(/likes/, [5701657165824000, 5760220017983488]);
    return Promise.all([
      fsp.readFile(path.resolve(C4P_FILENAME)),
      fsp.readFile(path.resolve(AGENDA_FILENAME))
    ]).then(([c4pContents, agendaContents]) => {
      fetchMock.get(/c4p$/, JSON.parse(c4pContents.toString()));
      fetchMock.get(/agenda/, JSON.parse(agendaContents.toString()));
    })
  })

  function initAndRender() {
    KoliseoAPI.init({
      c4pUrl: URL + '/c4p',
      oauthClientId: 'foobar'
    });
    return renderAgenda(element);
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

  it('renders with logged user', () => {
    return initAndRender().then(() => {
      assert.react.contains(element, '<a href="#undefined" data-id="111" class="ka-talk-title">Title for talk 1.1.1</a>');
    })
  })

  it('renders with anonymous user', () => {
    fetchMock.get(/me/, {
      name: "<anonymous>"
    });
    fetchMock.get(/likes/, { status: 401 });
    return initAndRender().then(() => {
      assert.react.contains(element, 'kk');
    })
  })

});
