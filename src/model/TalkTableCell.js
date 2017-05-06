// Data for a cell. 
// Can be a talk or information about a break
export default class TalkTableCell {

  constructor({ id, start, end, contents, currentUser, readOnly }) {

    // vertical and horizontal span for this cell, 1 for single row / column
    this.colSpan = this.rowSpan = 1;

    // talk id
    this.id = id;

    // start time
    this.start = start;

    // end time
    this.end = end;

    // type of the cell. One of:
    // 'TALK': see the talk data inside this.contents
    // 'BREAK': a break. See the break title in contents.title
    // 'EXTEND': this talk extends another track. See contents.trackId
    // undefined if the slot is empty
    this.type = contents && contents.type || undefined;

    // contents of the cell (see type). May be undefined if the slot is empty.
    this.contents = contents;

  }

}

