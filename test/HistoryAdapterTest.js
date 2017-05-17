import fsp from 'fs-promise';
import assert from './assertions';
import { initDOM } from './mock/jsdom-init';
import HistoryAdapter from '../src/controller/HistoryAdapter';
import Agenda from '../src/model/Agenda';
import path from 'path';

describe('TagsView', () => {

  initDOM();

  let agenda;

  before(() => {
    return fsp.readFile(path.resolve('test/json/agenda.json')).then((agendaJSON) => {
      agenda = new Agenda(JSON.parse(agendaJSON.toString()));
    })
  })

  it('initState', () => {
    HistoryAdapter.initState(agenda, 'kk');
    assert.equal('foo', location.hash);
  })

});
