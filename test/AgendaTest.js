import fsp from 'fs-promise';
import assert from "./assertions";
import Agenda from '../src/model/Agenda';
import path from 'path';

describe('Agenda', () => {

  let agenda;

  // uncomment to switch to easy mode :)
  // const AGENDA_FILENAME = 'test/json/agenda.json';
  const AGENDA_FILENAME = 'test/json/codemotion.json'; 

  before(() => {
    return fsp.readFile(path.resolve(AGENDA_FILENAME)).then((agendaJSON) => {
      agenda = new Agenda(JSON.parse(agendaJSON.toString()));
    })
  })


  describe('constructor', _ => {
    it('should parse agenda', () => {
      agenda.getDaysArray().forEach((day) => {
        console.log(day.name);
        console.log('===');
        console.log(assert.dayToString(day))
      });

      const day0 = agenda.getDaysArray()[0];
      assert.equal('["Track 1","Track 2","Track 3","Track 4","Track 5","Track 6","Track 7","Track 8","Track A","Track B","Track C","Track D"]', JSON.stringify(day0.colLabels));
      assert.equal('{"start":"08:00","end":"09:00"}', JSON.stringify(day0.rowLabels[0]));
      assert.equal('{"start":"09:00","end":"09:15"}', JSON.stringify(day0.rowLabels[1]));
      assert.equal('27 noviembre', day0.name);
      assert.equal('{"rowSpan":1,"colSpan":12,"id":47474001,"start":"08:00","end":"09:00","type":"BREAK","contents":{"type":"BREAK","title":"Registro"},"track":{"index":0,"id":5114954600415232,"name":"Track 1"}}', JSON.stringify(day0.data[0][0]));
      assert.equal('{"index":0,"id":5114954600415232,"name":"Track 1"}', JSON.stringify(day0.data[5][0].track));
      assert(agenda.cellsByHash["5699289732874240/5733608132182016"], "Could not find indexed talk");
      assert(agenda.cellsByHash["5699289732874240/5629608451899392"], "Could not find indexed talk");
      assert.equal('undefined', typeof day0.data[0][1]);
    });
  });

});
