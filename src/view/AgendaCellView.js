import { h, render, Component } from 'preact';
import LikeButton from './LikeButton';
import TalkFeedbackView from './TalkFeedbackView';

export default class AgendaCellView extends Component {

  constructor() {
    super();
    this.onClick = this.onClick.bind(e);
  }


  onClick(e) {
    debugger; // todo: review the next if
    if (e.button == 0 && !e.ctrlKey && !e.metaKey) {
      const hash = e.target.getAttribute('href').substring(1);
    }

  }

  renderSlides({ title, slidesUrl }) {
    return !slidesUrl ? undefined :
      <a href={slidesUrl} target="_blank" className="icon-slideshare" title="Slides"><span className="sr-only">Slides of "{title}"</span></a>
  }

  renderVideo({ title, videoUrl }) {
    return !videoUrl ? undefined :
      <a href={videoUrl} target="_blank" className="icon-youtube-play" title="Video"><span className="sr-only">Video of "{title}"</span></a>
  }

  renderTalk(talk) {
    const { id, hash, title, description, authors, tags, feedback, trackIndex, slidesUrl, videoUrl } = talk;
    const track = this.model.tracks[trackIndex];
    const slot = track.slots.find(slot => slot.contents.id == id);
    return (
      <div>
        <LikeButton talkId={id} />
        <p>
          <a href={'#' + hash} data-id={id} className="ka-talk-title">{title}</a>
        </p>
        <p className="ka-links">
          {this.renderSlides(talk)}
          {this.renderVideo(talk)}
        </p>
        <p className="ka-mobile-only">
          <span className={`ka-label ka-label-${trackIndex}`}>{track.name}</span>
          <span className="ka-time">{slot.start} - {slot.end}</span>
        </p>
        <div className="ka-feedback-footer">
          <TalkFeedbackView feedback={feedback} />
        </div>
        <p className="ka-author-brief">{authors.map((a) => a.name).join(', ')}</p>
      </div>
    )

  }

  render() {
    const { start, end, contents, rowSpan, colSpan, trackIndex } = this.props.contents;
    var type = contents && contents.type;
    var $contents =
      type === 'TALK' ? this.renderTalk({ ...contents, trackIndex }) :
        type === 'BREAK' ? contents.title :
          type === 'EXTEND' ? <div>Extended from <b>{this.model.tracks.find(track => track.id == contents.trackId).name}</b></div> :
            'Empty slot';

    return (
      type === 'EXTEND' && contents.merged ? undefined :
        <td className={'ka-table-td ' + (type && type.toLowerCase() || '')} rowspan={rowSpan} colspan={colSpan}>{$contents}</td>
    )
  }


}