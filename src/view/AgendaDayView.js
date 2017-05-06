/**

  Render a day table of talks as HTML

*/

import TalkFeedbackView from './TalkFeedbackView';

export default class AgendaDayView {

  constructor(model) {
    this.model = model;
  }

  render() {
    const model = this.model;
    return this.model.isEmpty()? '<h3>Nothing to see here</h3><p>There are no entries scheduled for this day.</p>' : `
      <table class="ka-table">
      <thead class="ka-head"><tr>${this.renderColLabels()}</tr></thead>
      <tbody class="ka-body">${this.renderBody()}</tbody>
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
      rowLabels.map(({start, end}, rowIndex) => {
        const row = this.model.data[rowIndex];
        return `
          <tr class="ka-table-tr">
          <th class="ka-table-th">${start}<span class="ka-mobile-hidden">-${end}</span></th>
          ${this.renderRow(row, rowIndex)}
          </tr>
          `
      }).join('')
    )
  }

  renderRow(row, rowIndex) {
    // TODO render time metadata. Hell, render all schema metadata, right?
    let rowContent = '';
    // DONT USE forEach here
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const cell = row[colIndex];
      if (cell) {
        // if we have to leave a blank space before
        let colOffset = this.calculateColOffset({rowIndex, colIndex});
        if (colOffset > 0) {
          rowContent += `<td class="ka-table-td-empty" colSpan="${colOffset}"></td>`;
        }
        rowContent += this.renderCell({...cell, trackIndex: colIndex});
      }
    }
    return rowContent;
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

  renderCell({ start, end, contents, rowSpan, colSpan, trackIndex }) {
    var type = contents && contents.type;
    var $contents =
      type === 'TALK'? this.renderTalk({...contents, trackIndex}) :
      type === 'BREAK'? contents.title :
      type === 'EXTEND'? `Extended from <b>${this.model.tracks.find(track => track.id == contents.trackId).name}</b>` :
      'Empty slot';

    return (
      type === 'EXTEND' && contents.merged? '' :
      ` <td class="ka-table-td ${type && type.toLowerCase() || ''}" rowspan="${rowSpan}" colspan="${colSpan}"> ${$contents} </td> `
    )
  }

  renderTalk(talk) {
    const { id, hash, title, description, authors, tags, feedback, trackIndex, slidesUrl, videoUrl } = talk;
    const track = this.model.tracks[trackIndex];
    const slot = track.slots.find(slot => slot.contents.id == id);
    return `
      ${LikeButtonUtils.renderButton(id)}
      <p>
        <a href="#${hash}" data-id="${id}" data-hash="${hash}" class="ka-talk-title">${title}</a>
      </p>
      ${!videoUrl && !slidesUrl? '' : `<p class="ka-links">
        ${this.renderSlides(talk)}
        ${this.renderVideo(talk)}
      </p>`}
      <p class="ka-mobile-only">
        <span class="ka-label ka-label-${trackIndex}">${track.name}</span>
        <span class="ka-time">${slot.start} - ${slot.end}</span>
      </p>
      <div class="ka-feedback-footer">${new TalkFeedbackView(arguments[0]).renderFeedback()}</div>
      <p class="ka-author-brief">${authors.map((a) => this.renderAuthor(a)).join(', ')}</p>
      `
  }

  renderSlides({ title, slidesUrl }) {
    return !slidesUrl? '' : 
      `<a href="${slidesUrl}" target="_blank" class="icon-slideshare" title="Slides"><span class="sr-only">Slides in new window of "${title}"</span></a>`;

  } 

  renderVideo({ title, videoUrl }) {
    return !videoUrl? '' : 
      `<a href="${videoUrl}" target="_blank" class="icon-youtube-play" title="Video"><span class="sr-only">Video in new window of "${title}"</span></a>`

  }

  renderAuthor({ id, uuid, name, avatar, description}) {
    return `${name}`
  }

  renderLikeButton({ id }) {
    const liked = this.user.isLiked(id);
    const state = liked? {
      value: 'selected',
      text: "I am planning to attend this talk"
    } : {
      value: 'default',
      text: "Click to mark this talk as favorite"
    };
    return `
      <span class="ka-like-container">
        <a class="ka-like icon-heart"
            title="${state.text}"
            data-talk-id="${id}"
            data-state="${state.value}">
        </a>
      </span>
    `;
  }


};

