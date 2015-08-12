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

  describe('findTalk', _ => {
    const UP = { rowDelta: -1, colDelta: 0 };
    const DOWN = { rowDelta: 1, colDelta: 0 };
    const LEFT = { rowDelta: 0, colDelta: -1 };
    const RIGHT = { rowDelta: 0, colDelta: 1 };

    it('should find the next vertical talk, gaps or not', function() {
      assert.equal(112, model.findTalk({ row: 0, col: 0 }, DOWN ).id);
      assert.equal(null, model.findTalk({ row: 1, col: 0 }, DOWN ));
    })

    it('should find the next horizontal talk, gaps or not', function() {
      assert.equal(121, model.findTalk({ row: 0, col: 0 }, RIGHT ).id);
      assert.equal(121, model.findTalk({ row: 1, col: 0 }, RIGHT ).id);
    })

    it('should respect boundaries', function() {
      assert.equal(null, model.findTalk({ row: 3, col: 0 }, DOWN ));
      assert.equal(null, model.findTalk({ row: 0, col: 0 }, UP ));
      assert.equal(null, model.findTalk({ row: 0, col: 0 }, LEFT ));
      assert.equal(null, model.findTalk({ row: 0, col: 1 }, RIGHT ));
    })

  })

});
