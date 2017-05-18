import AgendaCell from './AgendaCell';

/**

  Bidimensional array of talks. Represents the contents of an agenda for a day.


*/
export default class AgendaDay {

  constructor({ id, name, tracks }, cellsByHash) {

    // HACK: sort the tracks alphabetically. Once sorting is supported by Koliseo, this can be removed
    tracks.sort((t1, t2) => t1.name.localeCompare(t2.name));

    this.id = id;
    this.name = name;
    this.tracks = tracks.map(({id, name}, index) => {
      return { index, id, name }
    });

    // labels for rows
    // start: starting time, as string
    // end: ending time, as string
    let rowLabels = [];

    // labels for columns, corresponding to Track names
    const colLabels = this.colLabels = [];

    // calculate all row labels
    function addRowLabel(label) {
      rowLabels.indexOf(label) > -1 || rowLabels.push(label);
    }
    tracks.forEach(({ slots }, index) => {
      slots.forEach(({ start, end }) => {
        addRowLabel(start);
        addRowLabel(end);
      })
    });
    rowLabels.sort();

    rowLabels = this.rowLabels = rowLabels.map((label, index) => {
      return {
        start: label,
        end: index < rowLabels.length - 1? rowLabels[index + 1] : undefined
      };
    });

    // the last row is just the ending time of the event, and has no assigned talks.
    // It can be removed
    this.rowLabels.pop();

    // two-dimensional array of AgendaCell
    this.data = rowLabels.map(_ => []);

    // transform data from columns into rows, including rowspans
    let totalFilteredTalks = 0;
    tracks.forEach(({ id, name, slots }, colIndex) => {
      colLabels.push(name);
      slots.forEach((slot) => {
        const { start, end, contents } = slot;
        const rowIndex = this.getRowLabelIndex({ start });
        let row = this.data[rowIndex];
        const cell = row[colIndex] = new AgendaCell(slot, this.tracks[colIndex]);
        const endRowIndex = this.getRowLabelIndex({ end });
        cell.rowSpan = (endRowIndex - rowIndex) + 1;

        if (contents && contents.type === 'TALK') {
          const hash = this.id + '/' + contents.id;
          cell.contents.hash = hash;
          cellsByHash[hash] = cell;
          totalFilteredTalks++;
        }

      })
    });

    // the total number of talks that are selected by the current filter
    this.totalFilteredTalks = totalFilteredTalks;

    // calculate colSpans
    this.data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const extendedTrack = this.tracks[colIndex];

        if (cell) {
          if (cell.type != 'EXTEND') {
            let colSpan = 1;
            while (colIndex + colSpan < row.length) {
              const nextCell = row[colIndex + colSpan];
              if (!nextCell ||
                nextCell.type != 'EXTEND' ||
                nextCell.contents.trackId != extendedTrack.id) {
                break;
              }
              nextCell.contents.extendedTrack = extendedTrack;
              row[colIndex + colSpan] = undefined;
              colSpan++;
              nextCell.contents.merged = true;
            }
            cell.colSpan = colSpan;
          } else {
            if (!cell.contents.extendedTrack) {
              // set cell.contents.extendedTrack to the extended track if not already processed
              cell.contents.extendedTrack = this.tracks.find((t) => t.id == cell.contents.trackId);
            }
          }
        }
      })
    })


  }

  // return the row label index according to the passed argument
  // label.start
  // label.end
  getRowLabelIndex({ start, end }) {
    return this.rowLabels.indexOf(this.rowLabels.find(label => (!start || label.start == start) && (!end || label.end == end)));
  }

  isEmpty() {
    return this.colLabels.length === 0;
  }

  // Apply a filter to the agenda contents.
  // Will update AgendaCell.filteredOut for each cell
  applyFilter(filter) {
    let totalFilteredTalks = 0;
    this.data.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          cell.applyFilter(filter);
          if (cell.passesFilter && cell.contents && cell.contents.type == 'TALK') {
            totalFilteredTalks++;
          }
        }
      })
    });
    this.totalFilteredTalks = totalFilteredTalks;
  }


}
