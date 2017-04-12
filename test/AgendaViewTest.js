import jsdom from 'jsdom';
const doc = jsdom.jsdom('<html><body></body></html>', {
  // history in jsdoc requires a valid URL
  url: 'https://example.com/foo'
});
global.document = doc;
global.window = doc.defaultView;

import assert from 'assert';
import fsp from 'fs-promise';
import path from 'path';
import AgendaView from '../lib/AgendaView';

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

describe('AgendaView', () => {

  let element;

  beforeEach(() => {

    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders correctly', () => {
    return mount();
  })


});
