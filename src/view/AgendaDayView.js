import { h, render, Component } from 'preact';
import AgendaCellView from './AgendaCellView';
import PropTypes from 'prop-types';

/**
 * Render a day table of talks 
 */
export default class AgendaDayView extends Component {

  renderColLabels() {
    const labels = [''].concat(this.props.day.colLabels);
    return labels.map((label, index) => {
      return <th className="ka-table-th" key={index}>{label}</th>
    })
  }

  renderBody() {
    const {day} = this.props;
    const rowLabels = day.rowLabels;
    return (
      rowLabels.map(({start, end}, rowIndex) => {
        const row = day.data[rowIndex];
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
    return row.map((cell, index) => {
      return <AgendaCellView cell={cell} key={cell.id || (`empty-${index}`)}/>
    }) // filter null values
  }

  render() {
    const { day } = this.props;
    return day.isEmpty()? <div><h3>Nothing to see here</h3><p>There are no entries scheduled for this day.</p></div> :
      <table className="ka-table">
        <thead className="ka-head"><tr>{this.renderColLabels()}</tr></thead>
        <tbody className="ka-body">{this.renderBody()}</tbody>
      </table>
  }

};

AgendaDayView.propTypes = {
  // {AgendaDay} the day to render
  day: PropTypes.object.isRequired
}