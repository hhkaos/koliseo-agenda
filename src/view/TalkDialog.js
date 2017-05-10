import { h, render, Component } from 'preact';
import StarsView from './StarsView';
import { LikeButton } from './Buttons';
import { SlidesLink, VideoLink } from './Links';
import marked from 'marked';
import AvatarView from './AvatarView';
import FeedbackListView from './FeedbackListView';
import PropTypes from 'prop-types';

export function formatMarkdown(s) {
  return marked(s || '');
}

/**
 * Display a dialog with the talk contents
 */
export default class TalkDialog extends Component {

  constructor() {
    super();
    this.onKeyPress = this.onKeyPress.bind(this);
  }
  
  // escape key while viewing a talk closes the window
  onKeyPress(event) {
    if (!event.altKey && !event.ctrlKey && event.keyCode == 27) {
      AgendaActions.unselectTalk();
    }
  }

  renderLinks() {
    const { cell } = this.props; 
    const { slidesUrl, videoUrl, title } = cell.contents;
    return (
      <div className="ka-links ka-right">
        <LikeButton displayLabel={false} cell={cell}/>
        <SlidesLink href={slidesUrl} title={ title } />
        <VideoLink href={videoUrl} title={title} />
      </div>
    )
  }

  render() {

    const cell = this.props.cell;
    const { title, tags, feedback, description, authors } = cell.contents;

    return (
      <div className="ka-overlay ka-hidden" onKeyPress={this.onKeyPress}>
        <div className="ka-dialog">
          <a className="ka-close" title="close"></a>
          <div className="ka-dialog-contents">
            <h2 className="ka-dialog-title">
              { this.renderLinks() } 
              { title } 
              <StarsView rating={ feedback.ratingAverage } />
            </h2>
            <div className="ka-dialog-description" dangerouslySetInnerHTML={ formatMarkdown(description)}/>
            {this.renderTags(tags)}
          </div>
          <div className="ka-avatars">
            {authors.map(this.renderAuthor)}
          </div>
          <FeedbackListView cellId={cell.id}/>
        </div>
      </div>
    );
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
          <div className="ka-author-description" dangerouslySetInnerHTML={formatMarkdown(description)}></div>
        </div>
      </div>
    )
  }

};

TalkDialog.propTypes = {
  // {AgendaCell} the talk contents
  cell: PropTypes.object.isRequired,

  // { Json of {tag, colorIndex } } the list of colors to be used for displaying the talk tags
  tagColors: PropTypes.arrayOf(PropTypes.number).isRequired
}