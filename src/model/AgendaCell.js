import User from './User';

class CellContents {

  constructor({ authors, ...values }) {
    Object.assign(this, values);
    if (values.type == 'TALK') {
      if (authors) {
        this.authors = authors.map(author => new User(author));
      }
      this.feedback = this.feedback || {
        ratingAverage: 0,
        entriesCount: 0
      }
    }
  }

  // return true if this cell passes the query filter
  passesFilterQuery(queryTerms) {
    return !queryTerms.length || !!queryTerms.find((term) => {
      return term.test(this.title) ||
        term.test(this.description) || 
        !!this.authors.find(({ uuid, name, description }) => {
          return term.test(uuid) || term.test(name) || term.test(description)
        })
    })
  }

  // return true if this cell passes the tag filter
  passesFilterTags(tagCategories) {
    const keys = Object.keys(tagCategories);
    return !keys.length || keys.every(categoryName => {
      const expectedTags = tagCategories[categoryName];
      const actualTags = this.tags[categoryName];
      return !expectedTags.length || (actualTags && !!expectedTags.find(tag => {
        return actualTags.indexOf(tag) != -1;
      }))
    })
  }

}

// Data for a cell. 
// Can be a talk or information about a break
export default class AgendaCell {

  constructor({ id, start, end, contents, currentUser, readOnly }, track) {

    // vertical and horizontal span for this cell, 1 for single row / column
    this.colSpan = this.rowSpan = 1;

    // talk id
    this.id = id;

    // start time
    this.start = start;

    // end time
    this.end = end;

    // type of the cell. One of:
    // 'TALK': the talk data is available as this.contents
    // 'BREAK': a break. The break title is available as contents.title
    // 'EXTEND': this talk extends another track. The extended track is at contents.trackId
    // undefined if the slot is empty
    this.type = contents && contents.type || undefined;

    // true if this cell passes the criteria for the filter
    this.passesFilter = true;

    // contents of the cell (different according to type). May be undefined if the slot is empty.
    // TALK: { hash, title, description, authors, tags, feedback, slidesUrl, videoUrl }
    // BREAK: { title }
    // EXTENDED: { title, merged }
    this.contents = !contents? undefined : new CellContents(contents);

    // the data of this track
    this.track = track;

  }

  // apply a filter to this cell
  // returns the value of this.passesFilter
  applyFilter({ queryTerms, tags }) {
    const contents = this.contents;
    this.passesFilter = 
      !contents || 
      contents.type !== 'TALK' ||
      (
        contents.passesFilterQuery(queryTerms) &&
        contents.passesFilterTags(tags)
      );
  }

}

