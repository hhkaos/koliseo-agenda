/**

  Render a day table of talks as HTML

*/

class AgendaDayTemplate {

  constructor(model) {
    this.model = model;
    console.log(model);
  }

  render() {
    const model = this.model;
    return (
`
<h1 class="kday-title">${model.name}</h1>
<table class="kagenda-table">
<thead><tr>${this.renderColLabels()}</tr></thead>
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
    return (
      this.model.rowLabels.map((rowLabel, rowIndex) => {
        const row = this.model.data[rowIndex];
        // TODO render time metadata. Hell, render all scema metadata, right?
        return (
`
<tr class="kagenda-table-tr">
<td class="kagenda-table-th">${rowLabel}</td>
${row.map((row) => this.renderCell(row)).join('')}
</tr>
`
        )
      }).join('')
    )
  }

  renderCell({ start, end, type, contents }) {
    return (
`
<td class="kagenda-table-td">
${start} ${end} ${type}

${contents.id}
${contents.title}
${contents.description}
${contents.authors.map((a) => this.renderAuthor(a)).join('')}
${contents.tags.map((t) => this.renderTags(t)).join('')}
</td>
`
    )
  }

  renderAuthor({ id, uuid, name, avatar, description}) {
    todo()
  }

  renderTags({ tagName, tagValues}) {
    todo()
  }

};

export { AgendaDayTemplate }
