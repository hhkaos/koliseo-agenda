import { h, render, Component } from 'preact';
import { LikeButton } from './Buttons';
import { SlidesLink, VideoLink } from './Links';
import StarsView from './StarsView';
import PropTypes from 'prop-types';
import AgendaActions from '../actions/AgendaActions';

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
      <div>
        <LikeButton cell={cell} />
        <p>
          <a href={'#' + hash} data-id={cell.id} className="ka-talk-title" onClick={this.onClick}>{title}</a>
        </p>
        <p className="ka-links">
          <SlidesLink href={slidesUrl} title={title} />
          <VideoLink href={videoUrl} title={title} />
        </p>
        <div className="ka-feedback-footer">
          <StarsView rating={feedback.ratingAverage} />
        </div>
        <p className="ka-author-brief">{authors.map((a) => a.name).join(', ')}</p>
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
        <td className={'ka-table-td ' + (type && type.toLowerCase() || '')} rowspan={rowSpan} colspan={colSpan}>
          {$contents}
        </td>
    )
  }


}

AgendaCellView.propTypes = {
  // {AgendaCell} the cell to display
  cell: PropTypes.object.isRequired
}