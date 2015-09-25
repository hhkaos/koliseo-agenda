/**

  Render a day table of talks as HTML

*/

class AgendaDayTemplate {

  constructor(model) {
    this.model = model;
    //console.log(model);
  }

  render() {
    const model = this.model;
    return this.model.isEmpty()? '<h3>Nothing to see here</h3><p>There are no entries scheduled for this day.</p>' : `
      <table class="kagenda-table">
      <thead class="kagenda-head"><tr>${this.renderColLabels()}</tr></thead>
      <tbody>${this.renderBody()}</tbody>
      </table>
      `
  }

  renderColLabels() {
    const labels = [''].concat(this.model.colLabels);
    return labels.map((label, index) => {
      var trackId = ''; //this.model.tracks[index - 1].id;
      return `<th class="kagenda-table-th" data-track-id="${trackId}">${label}</th>`
    }).join('')
  }

  renderBody() {
    const rowLabels = this.model.rowLabels;
    return (
      rowLabels.map(({ start, end }, rowIndex) => {
        const row = this.model.data[rowIndex];
        // TODO render time metadata. Hell, render all scema metadata, right?
        return `
          <tr class="kagenda-table-tr">
          <td class="kagenda-table-th">${start}-${end}</td>
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
      ` <td class="kagenda-table-td ${type && type.toLowerCase() || ''}" rowspan="${rowSpan}" colspan="${colSpan}"> ${$contents} </td> `
    )
  }

  renderTalk({ id, hash, title, description, authors, tags }) {
    return `
      <a href="#${hash}" data-id="${id}" data-hash="${hash}" class="kagenda-talk-title">${title}</a>
      <p>${authors.map((a) => this.renderAuthor(a)).join(', ')}</p>
      `
  }

  renderAuthor({ id, uuid, name, avatar, description}) {
    return `${name}`
  }

};

export { AgendaDayTemplate }
