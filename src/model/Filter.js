import escapeRegExp from 'lodash.escaperegexp';

// Filter class
export default class Filter {

  constructor() {
    // query: the text to search
    this._query = '';

    // a list of RegExp corresponding to the search terms introduced
    this.queryTerms = [];

    // tags: JSON of { categoryName, tags } the tags to search for
    this.tags = {};
  }

  toggleTag(category, tag) {
    const tags = this.tags;
    const data = tags[category] || [];
    const index = data.indexOf(tag);
    if (index != -1) {
      data.splice(index, 1);
    } else {
      data.push(tag);
    }
    tags[category] = data;
  }

  // break query in parts that can be used for regexp search
  set query(q) {
    this._query = q;
    const terms = [];
    const QUERY_PART_REGEXP = /[^\s]+/g;
    while (true) {
      const parts = QUERY_PART_REGEXP.exec(q.toLowerCase());
      if (!parts) {
        break;
      }
      terms.push(parts[0])
    } 
    this.queryTerms = terms.map(term => new RegExp(escapeRegExp(term), "i"));
  }

  get query() {
    return this._query;
  }

}