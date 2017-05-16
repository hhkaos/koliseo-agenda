import { h, render, Component } from 'preact';
import { LikeButton } from './Buttons';
import { SlidesLink, VideoLink, StarLink } from './Links';
import AgendaActions from '../actions/AgendaActions';
import AvatarView from './AvatarView';
import TagsView from './TagsView';

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
      const hash = this.props.cell.contents.hash;
      AgendaActions.selectTalkByHash(hash);
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
    const { start, end, contents, rowSpan, colSpan, track } = cell;
    var type = contents && contents.type;
    var $contents =
      type === 'TALK'? this.renderTalk(cell) :
      type === 'BREAK'? contents.title :
      type === 'EXTEND' ? <div>Extended from <b>{contents.extendedTrack.name}</b></div> :
            'Empty slot';

    return (
      type === 'EXTEND' && contents.merged? undefined :
        <td 
          className={`ka-td ${type && type.toLowerCase() || ''} ka-track-${track.index}`} 
          rowspan={rowSpan} 
          colspan={colSpan}
          data-track-id={track.id}
          data-track-name={track.name}
        >
          {$contents}
        </td>
    )
  }


}

