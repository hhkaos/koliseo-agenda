/**

  Bidimensional array of talks. Represents the contents of an agenda for a day.

*/


// Data for a cell. Can be a talk or information about a break
class TalkTableCell {

  constructor({ id, start, end, type, contents }) {

    // vertical and horizontal span for this cell, 1 for single row / column
    this.colSpan = this.rowSpan = 1;

    // talk id
    this.id = id;

    // start time
    this.start = start;

    // end time
    this.end = end;

    // type of the cell (track or break)
    this.type = type;

    // contents of the cell (talk data or break information)
    this.contents = contents;
  }

}

class AgendaDayTableModel {

  constructor({ id, name, tracks }) {

    this.id = id;
    this.name = name;

    // labels for rows, corresponding to starting times
    const rowLabels = this.rowLabels = [];

    // labels for columns, corresponding to Track names
    const colLabels = this.colLabels = [];

    // two-dimensional array of TalkTableCell
    this.data = [[]];

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

    // transform data from columns into rows, including rowspans
    tracks.forEach(({ id, name, slots }, colIndex) => {
      colLabels.push(name);
      slots.forEach((slot) => {
        const rowIndex = rowLabels.indexOf(slot.start);
        let row = this.data[rowIndex];
        if (!row) {
          row = this.data[rowIndex] = [];
        }
        const cell = row[colIndex] = new TalkTableCell(slot);
        cell.rowSpan = rowLabels.indexOf(slot.end) - rowIndex;

      })
    });

    // calculate colSpans
    this.data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          let colSpan = 1;
          while (colIndex + colSpan < row.length) {
            const nextCell = row[colIndex + colSpan];
            if (!nextCell ||
              nextCell.type != cell.type ||
              nextCell.contents.title != cell.contents.title) {
              break;
            }
            row[colIndex + colSpan] = undefined;
            colSpan++;
          }
          cell.colSpan = colSpan;
        }
      })
    })

  }

  getCoords(talkId) {
    for (let rowIndex = 0; rowIndex < this.data.length; rowIndex++) {
      const row = this.data[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        if (row[colIndex].id == talkId) {
          return {
            row: rowIndex,
            col: colIndex
          }
        }
      }
    }
    return null;
  }

  // find the first talk starting at row, col and moving in rowDelta, colDelta direction
  // ignores breaks and gaps in the calendar
  findTalk({ row, col }, { rowDelta, colDelta }) {
    let newRowIndex = row + rowDelta;
    let newColIndex = col + colDelta;

    if (newColIndex > -1 && newRowIndex > -1) {

      if (colDelta) {
        const row = this.data[newRowIndex];
        const cell = row && row[newColIndex];
        if (cell && cell.type == 'TALK') {
          return cell;
        } else {
          // there is nothing on this cell. Search this new column up or down
          return this.findTalk({ row: newRowIndex, col: newColIndex }, { rowDelta: 1, colDelta: 0 }) ||
            this.findTalk({ row: newRowIndex, col: newColIndex }, { rowDelta: -1, colDelta: 0 })
        }

      }

      if (rowDelta) {
        while (newRowIndex >= 0 && newRowIndex < this.data.length) {
          const row = this.data[newRowIndex];
          const cell = row && row[newColIndex];
          if (cell && cell.type == 'TALK') {
            return cell;
          }
          newRowIndex += rowDelta;
        }
      }

    }
    return null;
  }

}

export { AgendaDayTableModel }
