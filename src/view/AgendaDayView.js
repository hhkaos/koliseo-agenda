import TalkFeedbackView from './TalkFeedbackView';
import { h, render, Component } from 'preact';
import AgendaCellView from './AgendaCellView';

/**
 * Render a day table of talks 
 * Properties:
 * model: {AgendaDay} the day to render
 */
export default class AgendaDayView extends Component {

  render() {
    const { model } = this.props;
    return model.isEmpty()? <div><h3>Nothing to see here</h3><p>There are no entries scheduled for this day.</p></div> : 
      <table className="ka-table">
        <thead className="ka-head"><tr>{this.renderColLabels()}</tr></thead>
        <tbody className="ka-body">{this.renderBody()}</tbody>
      </table>
  }

  renderColLabels() {
    const labels = [''].concat(this.props.model.colLabels);
    return labels.map((label, index) => {
      var trackId = ''; //this.model.tracks[index - 1].id;
      return <th className="ka-table-th" data-track-id={trackId} key={index}>{label}</th>
    })
  }

  renderBody() {
    const rowLabels = this.model.rowLabels;
    return (
      rowLabels.map(({start, end}, rowIndex) => {
        const row = this.props.model.data[rowIndex];
        return (
          <tr className="ka-table-tr" key={rowIndex}>
            <th className="ka-table-th">{start}<span className="ka-mobile-hidden">-{end}</span></th>
            {this.renderRow(row, rowIndex)}
          </tr>
        )
      })
    )
  }

  renderRow(row, rowIndex) {
    let rowContent = [];
    return row.map((cell, index) => {
      if (cell) {
        // if we have to leave a blank space before
        let colOffset = this.calculateColOffset({ rowIndex, colIndex });
        return colOffset > 0?
          <td className="ka-table-td-empty" colSpan={colOffset}></td> :
          <AgendaCellView contents={{ ...cell, trackIndex: colIndex }}/>
      }
    }).filter(cell => !!cell) // filter null values
  }

  calculateColOffset({rowIndex, colIndex}) {
    let offset = colIndex;
    const maxOffset = colIndex;
    if (rowIndex >= 0 && colIndex > 0) {
      // for this row and the ones before
      for (let rIndex = rowIndex; rIndex >= 0; rIndex--) {
        // for each previous column on that row
        for (let cIndex = colIndex - 1; cIndex >= 0; cIndex--) {
          let cell = this.model.data[rIndex][cIndex];
          if (cell && cell.rowSpan - rowIndex + rIndex >= 0) {
            offset--;
          }
        }
      }
    }
    return offset;
  }


};

