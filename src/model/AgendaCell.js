// Data for a cell. 
// Can be a talk or information about a break
export default class AgendaCell {

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
    // 'TALK': the talk data is available as this.contents
    // 'BREAK': a break. The break title is available as contents.title
    // 'EXTEND': this talk extends another track. The extended track is at contents.trackId
    // undefined if the slot is empty
    this.type = contents && contents.type || undefined;

    // contents of the cell (see type). May be undefined if the slot is empty.
    this.contents = contents;

  }

}

