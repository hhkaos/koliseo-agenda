
import assert from './assertions';
import fsp from 'fs-promise';
import path from 'path';
import renderAgenda from '../src/view/AgendaView';
import KoliseoAPI from '../src/controller/KoliseoAPI';
import fetchMock from 'fetch-mock';
import 'mock-local-storage';
import {URL, initDOM} from './jsdom-init'; 

describe('AgendaBootstrap', () => {

  initDOM();
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

  it('renders correctly', () => {
    return initAndRender().then(() => {
      assert.react.exists(element, 'kk');
    })
  })


});
