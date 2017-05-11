import assert from 'assert';

assert.dayToString = function(day) {
  return day.data.map(row => {
    return row.map((cell) => {
      return !cell ? 'undefined' : `${cell.type} (${cell.rowSpan} rows, ${cell.colSpan} cols)`
    }).join('; ')
  }).join(String.fromCharCode(13))
}

assert.react = {

  contains(element, text) {
    assert(element.innerHTML.includes(text), `Could not find "${text}" inside of element. Current contents:\n${element.innerHTML}`);
  },

  notContains(element, text) {
    assert(!element.innerHTML.includes(text), `Not expecting "${text}" inside of element. Current contents:\n${element.innerHTML}`);
  },

  // assert that a node exists inside the enzyme component wrapper
  exists(element, selector) {
    assert(element.querySelectorAll(selector).length > 0, `Could not find ${selector} inside of element. Current contents: ${element.innerHTML}`);
  },

  notExists(element, selector) {
    assert(element.querySelectorAll(selector).length === 0, `Not expecting ${selector} inside of element. Current contents: ${element.innerHTML}`);
  }

};
export default assert;