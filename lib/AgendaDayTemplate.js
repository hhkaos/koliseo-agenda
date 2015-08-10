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
    return (
`
<h1 class="kday-title">${model.name}</h1>
<table class="kagenda-table">
<thead class="kagenda-head"><tr>${this.renderColLabels()}</tr></thead>
<tbody>${this.renderBody()}</tbody>
</table>
`
    );
  }

  renderColLabels() {
    const labels = [''].concat(this.model.colLabels);
    return labels.map((label) => {
      return `<th class="kagenda-table-th">${label}</th>`
    }).join('')
  }

  renderBody() {
    const rowLabels = this.model.rowLabels;
    return (
      rowLabels.map((rowLabel, rowIndex) => {
        const row = this.model.data[rowIndex];
        rowLabel = rowLabel + (rowIndex == rowLabels.length - 1? '' : '-' + rowLabels[rowIndex + 1]);
        // TODO render time metadata. Hell, render all scema metadata, right?
        return (
`
<tr class="kagenda-table-tr">
<td class="kagenda-table-th">${rowLabel}</td>
${!row? '' : row.map((cell) => !cell? '' : this.renderCell(cell)).join('')}
</tr>
`
        )
      }).join('')
    )
  }

  renderCell({ start, end, type, contents, rowSpan, colSpan }) {
    return (
`
<td class="kagenda-table-td ${type.toLowerCase()}" rowspan="${rowSpan}" colspan="${colSpan}">
${type !== 'BREAK'? this.renderTalk(contents) : contents.title}
</td>
`
    )
  }

  renderTalk({ id, hash, title, description, authors, tags }) {
    return (
`
<div class="kagenda-cell-contents">

<a href="#${hash}" data-id="${id}" data-hash="${hash}" class="kagenda-talk-title">${title}</a>
${authors.map((a) => this.renderAuthor(a)).join('')}
${Object.keys(tags).map((key) => this.renderTags(key, tags[key])).join('')}
</div>
`
    )
  }

  renderAuthor({ id, uuid, name, avatar, description}) {
    return (
`
${id}
${uuid}
${name}
${avatar}
${description}
`
    )
  }

  renderTags(tagName, tagValues) {
    return (
`
${tagName}
${tagValues.map((tag) => tag).join('')}
`
    )
  }

};

export { AgendaDayTemplate }
