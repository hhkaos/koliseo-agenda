/**

  Render a day table of talks as HTML

*/

import { TalkFeedback } from './feedback';

class AgendaDayTemplate {

  constructor(model) {
    this.model = model;
  }

  render() {
    const model = this.model;
    return this.model.isEmpty()? '<h3>Nothing to see here</h3><p>There are no entries scheduled for this day.</p>' : `
      <table class="ka-table">
      <thead class="ka-head"><tr>${this.renderColLabels()}</tr></thead>
      <tbody>${this.renderBody()}</tbody>
      </table>
      `
  }

  renderColLabels() {
    const labels = [''].concat(this.model.colLabels);
    return labels.map((label, index) => {
      var trackId = ''; //this.model.tracks[index - 1].id;
      return `<th class="ka-table-th" data-track-id="${trackId}">${label}</th>`
    }).join('')
  }

  renderBody() {
    const rowLabels = this.model.rowLabels;
    return (
      rowLabels.map(({ start, end }, rowIndex) => {
        const row = this.model.data[rowIndex];
        // TODO render time metadata. Hell, render all scema metadata, right?
        return `
          <tr class="ka-table-tr">
          <td class="ka-table-th">${start}-${end}</td>
          ${!row? '' : row.map((cell) => !cell? '' : this.renderCell(cell)).join('')}
          </tr>
          `
      }).join('')
    )
  }

  renderCell({ start, end, contents, rowSpan, colSpan }) {
    var type = contents && contents.type;
    var $contents =
      type === 'TALK'? this.renderTalk(contents) :
      type === 'BREAK'? contents.title :
      type === 'EXTEND'? `Extended from <b>${this.model.tracks.find(track => track.id == contents.trackId).name}</b>` :
      'Empty slot';


    return (
      type === 'EXTEND' && contents.merged? '' :
      ` <td class="ka-table-td ${type && type.toLowerCase() || ''}" rowspan="${rowSpan}" colspan="${colSpan}"> ${$contents} </td> `
    )
  }

  renderTalk({ id, hash, title, description, authors, tags, feedback }) {
    return `
      <p>
        <a href="#${hash}" data-id="${id}" data-hash="${hash}" class="ka-talk-title">${title}</a>
      </p>
      <div class="ka-feedback-footer">${new TalkFeedback(arguments[0]).renderFeedback()}</div>
      <p class="ka-author-brief">${authors.map((a) => this.renderAuthor(a)).join(', ')}</p>
      `
  }

  renderAuthor({ id, uuid, name, avatar, description}) {
    return `${name}`
  }

};

export { AgendaDayTemplate }
