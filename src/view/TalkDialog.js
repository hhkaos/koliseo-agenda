import { h, render, Component } from 'preact';
import StarsView from './StarsView';
import { LikeButton } from './Buttons';
import { SlidesLink, VideoLink } from './Links';
import marked from 'marked';
import AvatarView from './AvatarView';
import FeedbackListView from './FeedbackListView';
import PropTypes from 'prop-types';
import AgendaActions from '../actions/AgendaActions';

export function formatMarkdown(s) {
  return marked(s || '');
}

/**
 * Display a dialog with the talk contents
 * 
 * {AgendaCell, required} the talk contents
 * selectedCell
 *
 * { Json of {tag, colorIndex } } the list of colors to be used for displaying the talk tags
 * tagColors
 * 
 * {boolean} true if feedback is enabled
 * feedbackEnabled
 */
export default class TalkDialog extends Component {

  constructor() {
    super();
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  
  // escape key while viewing a talk closes the window
  onKeyPress(event) {
    if (!event.altKey && !event.ctrlKey && event.keyCode == 27) {
      AgendaActions.unselectTalk();
    }
  }

  onClose(e) {
    e.preventDefault();
    AgendaActions.unselectTalk();
  }

  renderLinks() {
    const { selectedCell } = this.props; 
    const { slidesUrl, videoUrl, title } = selectedCell.contents;
    return (
      <div className="ka-links ka-right">
        <LikeButton displayLabel={false} cell={selectedCell}/>
        <SlidesLink href={slidesUrl} title={ title } />
        <VideoLink href={videoUrl} title={title} />
      </div>
    )
  }

  renderTags(tags) {
    if (!tags) {
      return undefined;
    }
    return (
      <div className="ka-tags">
        {
          Object.keys(tags).map(category => {
            return tags[category].map(tag => <span key={category} className={ 'tag tag' + this.props.tagColors[category] }>{tag}</span>)
          }) 
        }
      </div>
    )
  }

  renderAuthor(user) {
    const { id, uuid, name, avatar, description, twitterAccount } = user;
    return (
      <div className="ka-avatar-li ka-avatar-and-text">
        <AvatarView user={user}/>
        <span className="ka-author-name-container">
          <a href={'https://www.koliseo.com/' + uuid} className="ka-author-name">{name}</a>
          {!twitterAccount ? undefined : <a href={'https://twitter.com/' + twitterAccount} className="ka-author-twitter" target="_blank">@{twitterAccount}</a>}
        </span>
        <div className="ka-author-data">
          <div className="ka-author-description" dangerouslySetInnerHTML={{ __html: formatMarkdown(description)}}></div>
        </div>
      </div>
    )
  }

  render() {

    const { selectedCell, feedbackEnabled } = this.props;
    if (!selectedCell) {
      return undefined;
    }

    const { title, tags, feedback, description, authors } = selectedCell.contents;
    return (
      <div className="ka-overlay" onKeyPress={this.onKeyPress}>
        <div className="ka-dialog">
          <a className="ka-close" title="close" onClick={this.onClose}></a>
          <div className="ka-dialog-contents">
            <h2 className="ka-dialog-title">
              {this.renderLinks()}
              {title}
              <StarsView rating={feedback.ratingAverage} />
            </h2>
            <div className="ka-dialog-description" dangerouslySetInnerHTML={{ __html: formatMarkdown(description) }} />
            {this.renderTags(tags)}
          </div>
          <div className="ka-avatars">
            {authors.map(this.renderAuthor)}
          </div>
          <FeedbackListView cellId={selectedCell.id} feedbackEnabled={feedbackEnabled} />
        </div>
      </div>
    );
  }

};

