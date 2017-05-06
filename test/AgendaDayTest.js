import assert from "assert";
import AgendaDay from '../src/model/AgendaDay';
import dayJSON from './json/day-mock';

describe('AgendaDay', () => {

  const model = new AgendaDay(dayJSON);

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

});
