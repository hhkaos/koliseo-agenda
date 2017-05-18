import { h, render, Component } from 'preact';
import { LikeButton } from './Buttons';
import { SlidesLink, VideoLink, StarLink } from './Links';
import AgendaActions from '../actions/AgendaActions';
import AvatarView from './AvatarView';
import TagsView from './TagsView';
import HistoryAdapter from '../controller/HistoryAdapter';

/**
 * Render a table cell
 * 
 * {AgendaCell, required} the cell to display
 * cell
 * 
 */
export default class AgendaCellView extends Component {

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (e.button == 0 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const { hash, title } = this.props.cell.contents;
      AgendaActions.selectTalkByHash(hash);
      HistoryAdapter.pushState({ title: title, hash });
    }
  }

  renderTalk(cell) {
    const { hash, title, description, authors, tags, feedback, slidesUrl, videoUrl } = cell.contents;
    return (
      <div class="ka-td-contents">
        <AvatarView users={authors} onClick={this.onClick} href={'#' + hash} />
        <div className="ka-username">
          {authors.map((a) => a.name).join(', ')}
        </div>
        <p className="ka-talk-title">
          <a href={'#' + hash} data-id={cell.id} onClick={this.onClick}>{title}</a>
        </p>
        <TagsView tags={tags} />
        <div className="ka-td-footer">
          <SlidesLink href={slidesUrl} title={title} />
          <VideoLink href={videoUrl} title={title} />
          <LikeButton cell={cell} />
          <StarLink rating={feedback.ratingAverage} entriesCount={feedback.entriesCount} onClick={this.onClick}/>
        </div>
      </div>
    )

  }

  render() {
    const { cell } = this.props;
    const { start, end, contents, rowSpan, colSpan, track, passesFilter } = cell;
    const type = contents && contents.type;
    const $contents =
      type === 'TALK'? this.renderTalk(cell) :
      type === 'BREAK'? contents.title :
      type === 'EXTEND' ? <div>Extended from <b>{contents.extendedTrack.name}</b></div> :
            'Empty slot';
    const classList = [
      'ka-td',
      `ka-track-${track.index}`,
      type && type.toLowerCase() || '',
      passesFilter? '' : 'filtered-out'
    ];

    return (
      type === 'EXTEND' && contents.merged? undefined :
        <td 
          className={ classList.join(' ') } 
          rowspan={rowSpan} 
          colspan={colSpan}
          data-track-id={track.id}
          data-track-name={track.name}
          data-time={ start + '-' + end }
        >
          {$contents}
        </td>
    )
  }


}

