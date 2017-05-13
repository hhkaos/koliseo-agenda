import { h, render, Component } from 'preact';
import { LikeButton } from './Buttons';
import { SlidesLink, VideoLink } from './Links';
import { SmallView } from './StarsView';
import PropTypes from 'prop-types';
import AgendaActions from '../actions/AgendaActions';
import AvatarView from './AvatarView';

export default class AgendaCellView extends Component {

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (e.button == 0 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const hash = e.target.getAttribute('href').substring(1);
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
        <div className="ka-td-footer">
          <SlidesLink href={slidesUrl} title={title} />
          <VideoLink href={videoUrl} title={title} />
        </div>
        <div className="ka-td-footer">
          <LikeButton cell={cell} />
          <SmallView rating={feedback.ratingAverage} entriesCount={feedback.entriesCount} />
        </div>
      </div>
    )

  }

  render() {
    const { cell } = this.props;
    const { start, end, contents, rowSpan, colSpan } = cell;
    var type = contents && contents.type;
    var $contents =
      type === 'TALK'? this.renderTalk(cell) :
      type === 'BREAK'? contents.title :
      type === 'EXTEND'? <div>Extended from <b>{contents.name}</b></div> :
            'Empty slot';

    return (
      type === 'EXTEND' && contents.merged? undefined :
        <td className={'ka-td ' + (type && type.toLowerCase() || '')} rowspan={rowSpan} colspan={colSpan}>
          {$contents}
        </td>
    )
  }


}

AgendaCellView.propTypes = {
  // {AgendaCell} the cell to display
  cell: PropTypes.object.isRequired
}