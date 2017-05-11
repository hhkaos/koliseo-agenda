import fsp from 'fs-promise';
import assert from "./assertions";
import Agenda from '../src/model/Agenda';
import path from 'path';

describe('Agenda', () => {

  let agenda;

  // uncomment to switch to easy mode :)
  // const AGENDA_FILENAME = 'test/json/talks.json';
  const AGENDA_FILENAME = 'test/json/codemotion.json'; 

  before(() => {
    return fsp.readFile(path.resolve(AGENDA_FILENAME)).then((agendaJSON) => {
      agenda = new Agenda(JSON.parse(agendaJSON.toString()));
    })
  })


  describe('constructor', _ => {
    it('should parse agenda', () => {
      agenda.getDaysArray().map((day) => {
        console.log(day.name);
        console.log('===');
        console.log(assert.dayToString(day))
      });

      const day0 = agenda.getDaysArray()[0];
      assert.equal('["Track 1","Track 2","Track 3","Track 4","Track 5","Track 6","Track 7","Track 8","Track A","Track B","Track C","Track D"]', JSON.stringify(day0.colLabels));
      assert.equal('{"start":"08:00","end":"09:00"}', JSON.stringify(day0.rowLabels[0]));
      assert.equal('{"start":"09:00","end":"09:15"}', JSON.stringify(day0.rowLabels[1]));
      assert.equal('27 noviembre', day0.name);
      assert.equal('{"rowSpan":1,"colSpan":12,"id":47474001,"start":"08:00","end":"09:00","type":"BREAK","contents":{"type":"BREAK","title":"Registro"}}', JSON.stringify(day0.data[0][0]));
      assert.equal('kk', JSON.stringify(day0.data[0][1]));
      assert.equal('kk', agenda.cellsByHash);
    })
  });

});
