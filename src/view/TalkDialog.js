import { h, render, Component } from 'preact';
import StarsView from './StarsView';
import { LikeButton } from './Buttons';
import { SlidesLink, VideoLink, ExternalFlag } from './Links';
import marked from 'marked';
import AvatarView from './AvatarView';
import FeedbackListView from './FeedbackListView';
import AgendaActions from '../actions/AgendaActions';
import TagsView from './TagsView';

export function formatMarkdown(s) {
  return marked(s || '');
}

const FirstChild = (props) => {
  return props.children[0] || null
}

const ANIMATION_TIMEOUT = 300;

/**
 * Display a dialog with the talk contents
 * 
 * {AgendaCell, required} the talk contents
 * selectedCell
 *
 */
export default class TalkDialog extends Component {

  constructor() {
    super();
    this.state = {
      // used to animate the dialog opacity
      // hidden
    }
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyPress);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        hidden: true
      });
      setTimeout(() => this.setState({
        hidden: false
      }), 0);
    }
  }
  
  // escape key while viewing a talk closes the window
  onKeyPress(event) {
    if (!event.altKey && !event.ctrlKey && event.keyCode == 27) {
      this.close();
    }
  }

  onClickClose(e) {
    const classList = e.target.classList;
    if (classList.contains('ka-close') || classList.contains('ka-overlay')) {
      e.preventDefault();
      this.close();
    }
  }

  close() {
    if (this.props.selectedCell) {
      this.setState({
        hidden: true
      });
      setTimeout(() => AgendaActions.unselectTalk(), ANIMATION_TIMEOUT);    
    }
  }

  renderLinks() {
    const { selectedCell } = this.props; 
    const { slidesUrl, videoUrl, title } = selectedCell.contents;
    return (
      <div className="ka-talk-buttons">
        <LikeButton className="ka-button ka-button-with-indicator" displayLabel={true} cell={selectedCell}/>
        <SlidesLink className="ka-button" href={slidesUrl} title={title}>
          Slides <ExternalFlag/>
        </SlidesLink>
        <VideoLink className="ka-button" href={videoUrl} title={title}>
          Video <ExternalFlag />
        </VideoLink>
      </div>
    )
  }

  renderAuthor(user) {
    const { id, uuid, name, avatar, description, twitterAccount } = user;
    return (
      <div className="ka-dialog-section ka-avatar-and-text" key={user.id}>
        <AvatarView user={user}/>
        <div className="ka-avatar-text">
          <h3 className="ka-author-header">
            {name}
            {
              twitterAccount && 
              <a href={'https://twitter.com/' + twitterAccount}              className="ka-author-twitter" target="_blank" rel="noopener">
                @{twitterAccount}
              </a>
            }
          </h3>
          {
            description && 
            <div 
              className="ka-author-description" 
              dangerouslySetInnerHTML={{ __html: formatMarkdown(description)}} 
            />
          }
        </div>
      </div>
    )
  }

  renderHeader(title, feedback) {
    return (
      <div className="ka-dialog-header">
        <a className="ka-close" title="close" onClick={this.onClickClose}></a>
        <h2 className="ka-dialog-title">
          {title}
        </h2>
        <div className="ka-stats">
          <StarsView rating={feedback.ratingAverage} />
          {`${feedback.ratingAverage} out of ${feedback.entriesCount} votes`}
        </div>
      </div>
    );
  }

  render() {
    const { hidden } = this.state;
    const { selectedCell } = this.props;
    const { id, contents = {} } = selectedCell || {};
    const { title, tags, feedback, description, authors } = contents;
    return (
      selectedCell && 
      <div className={"ka-overlay" + (hidden? ' ka-hidden' : '')} 
        onClick={this.onClickClose}
        >
        <div className="ka-dialog">
          { this.renderHeader(title, feedback) }
          <div className="ka-dialog-contents">
            <div className="ka-dialog-section">
              <div 
                className="ka-dialog-description" 
                dangerouslySetInnerHTML={{ __html: formatMarkdown(description) }} 
              />
              <TagsView tags={tags} />
              {this.renderLinks()}
            </div>
            {authors.map(this.renderAuthor)}
          </div>
          <div className="ka-dialog-contents">
            <FeedbackListView cell={selectedCell} />
          </div>
        </div>
      </div>
    )
  }

};

