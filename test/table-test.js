import assert from "assert";
import { AgendaDayTableModel } from '../lib/AgendaDayTableModel';
import dayJSON from './day-mock';

describe('AgendaDayTableModel', () => {

  const model = new AgendaDayTableModel(dayJSON);

  console.log(model.data.map(row => {
    return row.map((cell) => !cell? 'undefined; ' : `rows: ${cell.rowSpan}, cols: ${cell.colSpan}; `)
  }).join('\n'));

  describe('constructor', _ => {
    it('should accumulate row and col labels from all talks', () => {
      assert.equal(
        '["09:00-10:00","10:00-11:00","11:00-11:15"]',
        JSON.stringify(model.rowLabels.map(({start, end}) => `${start}-${end}`))
      );
      assert.equal('["Track 1","Track 2"]', JSON.stringify(model.colLabels));
      assert.equal(3, model.rowLabels.length);
      assert.equal(2, model.colLabels.length);
    })
    it('should span multiple rows', function() {
      assert.equal(1, model.data[0][0].rowSpan);
      assert.equal(2, model.data[0][1].rowSpan);
    });
    it('should span multiple columns', function() {
      assert.equal(1, model.data[0][0].colSpan);
      assert.equal(2, model.data[2][0].colSpan);
    });
  });

  describe('getCoords', _ => {
    it('should return coordinates 1,0', function() {
      const coords = model.getCoords(112);
      assert.equal(1, coords.row);
      assert.equal(0, coords.col);
    })
  });

});
