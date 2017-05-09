import AgendaCell from './AgendaCell';

/**

  Bidimensional array of talks. Represents the contents of an agenda for a day.


*/
export default class AgendaDay {

  constructor({ id, name, tracks }) {

    // HACK: sort the tracks alphabetically. Once sorting is supported by Koliseo, this can be removed
    tracks.sort((t1, t2) => t1.name.localeCompare(t2.name));

    this.id = id;
    this.name = name;
    this.tracks = tracks;

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
    tracks.forEach(({ id, name, slots }, colIndex) => {
      colLabels.push(name);
      slots.forEach((slot) => {
        const rowIndex = this.getRowLabelIndex({ start: slot.start });
        let row = this.data[rowIndex];
        const cell = row[colIndex] = new AgendaCell(slot);
        const endRowIndex = this.getRowLabelIndex({ end: slot.end });
        cell.rowSpan = (endRowIndex - rowIndex) + 1;

      })
    });

    // calculate colSpans
    this.data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell && cell.type != 'EXTEND') {
          let colSpan = 1;
          const trackId = tracks[colIndex].id;
          while (colIndex + colSpan < row.length) {
            const nextCell = row[colIndex + colSpan];
            if (!nextCell ||
              nextCell.type != 'EXTEND' ||
              nextCell.contents.trackId != trackId) {
              break;
            }
            row[colIndex + colSpan] = undefined;
            colSpan++;
            nextCell.contents.merged = true;
          }
          cell.colSpan = colSpan;
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

}
