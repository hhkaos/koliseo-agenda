import assert from "./assertions";
import AgendaCell from "../src/model/AgendaCell";
import MockCell from './mock/MockCell';
import Filter from '../src/model/Filter';

describe('Filter', () => {

  let agendaCell;

  beforeEach(() => {
    agendaCell = new AgendaCell(MockCell);
  })

  function shouldPassFilter(f) {
    const filter = Object.assign(new Filter(), f);
    agendaCell.applyFilter(filter);
    assert(agendaCell.passesFilter, "Cell should pass filter: " + JSON.stringify(filter) + " with contents: " + JSON.stringify(agendaCell));
  }

  function shouldNotPassFilter(f) {
    const filter = Object.assign(new Filter(), f);
    agendaCell.applyFilter(filter);
    assert(!agendaCell.passesFilter, "Cell should NOT pass filter: " + JSON.stringify(filter) + " with contents: " + JSON.stringify(agendaCell));
  }

  it('should toggle tags and detect for isEmpty()', () => {
    const f = new Filter();
    assert(f.isEmpty());
    
    f.toggleTag('Language', 'Spanish');
    assert(!f.isEmpty());
    assert.equal('{"Language":["Spanish"]}', JSON.stringify(f.tags));
    
    f.toggleTag('Language', 'Spanish');
    assert(f.isEmpty());
    assert.equal('{"Language":[]}', JSON.stringify(f.tags));
    
    f.toggleTag('Language', 'Spanish');
    f.toggleTag('Language', 'English');
    assert.equal('{"Language":["Spanish","English"]}', JSON.stringify(f.tags));    
  });

  it('should parse query terms', () => {
    const f = new Filter();
    f.query = '   xxx 123 yyy';
    assert.equal(3, f.queryTerms.length);
    assert(!f.isEmpty());
  })

  it('should pass an empty filter', () => {
    shouldPassFilter({ query: "", tags: {} });
    shouldPassFilter({ tags: {} });
  })

  it('should filter by query', () => {
    // uppercase match 
    shouldPassFilter({ query: " xxx TITLE yyy" });

    // multiple strings matching the description
    shouldPassFilter({ query: " title talk" });

    // string matching an author
    shouldPassFilter({ query: "Coloma" })

    // not a match
    shouldNotPassFilter({ query: " xxx yyy" });

    // special chars
    shouldPassFilter({ query: " ([kk * title" });
  });

  it('should filter by tags', () => {
    // matches one tag, misses the other (AND)
    shouldNotPassFilter({ 
      tags: { 
        xx: ['yyy'],
        Technology: ["Other" ]
      } 
    });

    // matches all tags (AND)
    shouldPassFilter({
      tags: {
        "Type of Proposal": ['Workshop'],
        Technology: ["Other"]
      }
    });

    // matches one tag of many (OR)
    shouldPassFilter({
      tags: {
        "Language of the talk/workshop": [
          "Spanish", "English"
        ]
      }
    });

    // misses the tag
    shouldNotPassFilter({
      tags: {
        "Language of the talk/workshop": [
          "English"
        ]
      }
    });

    // empty tag category
    shouldPassFilter({
      tags: {
        "Language of the talk/workshop": []
      }
    });
  });

  it('should filter by query and tag', () => {
    // match both 
    shouldPassFilter({ 
      query: " xxx TITLE yyy",
      tags: { Technology: ["Other"] }
    });
    // miss query
    shouldNotPassFilter({
      query: " xxx yyy",
      tags: { Technology: ["Other"] }
    });
    // miss tag
    shouldNotPassFilter({
      query: "title",
      tags: { xxx: ["Other"] }
    });
  });

  it('should work on break cells', () => {
    agendaCell = new AgendaCell({
      "id": 47474001,
      "start": "08:00",
      "end": "09:00",
      "contents": {
        "type": "BREAK",
        "title": "Registro"
      },
      "userId": 36484001,
      "trackId": 5114954600415232
    });
    shouldPassFilter({
      query: " xxx yyy",
      tags: { Technology: ["Other"] }
    });
  })

});