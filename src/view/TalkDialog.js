import { h, render, Component } from 'preact';
import { strToEl, transitionTo, transitionFrom } from '../util';
import TalkStarsView from './TalkStarsView';
import { LikeButton } from './Buttons';
import { SlidesLink, VideoLink } from './Links';
import marked from 'marked';
import AvatarView from './AvatarView';
import TalkFeedbackListView from './TalkFeedbackListView';

export function formatMarkdown(s) {
  return marked(s || '');
}

/**
 * Display a dialog with the talk contents
 * Properties:
 * talk: {AgendaCell} the talk contents
 * tagColors: { Json of {tag, colorIndex} } the list of colors to be used for displaying the talk tags
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
    const { talk } = this.props; 
    const { slidesUrl, videoUrl, title } = talk.contents;
    return (
      <div className="ka-links ka-right">
        <LikeButton displayLabel={false} talk={talk}/>
        <SlidesLink href={slidesUrl} title={ title } />
        <VideoLink href={videoUrl} title={title} />
      </div>
    )
  }

  render() {

    const talk = this.props.talk;
    return (
      <div className="ka-overlay ka-hidden" onKeyPress={this.onKeyPress}>
        <div className="ka-dialog">
          <a className="ka-close" title="close"></a>
          <div className="ka-dialog-contents">
            <h2 className="ka-dialog-title">
              { this.renderLinks() } 
              {talk.title} 
              <TalkStarsView feedback={talk.feedback} />
            </h2>
            <div className="ka-dialog-description" dangerouslySetInnerHTML={formatMarkdown(talk.description)}/>
            {this.renderTags(talk.tags)}
          </div>
          <div className="ka-avatars">
            {talk.contents.authors.map(this.renderAuthor)}
          </div>
          <TalkFeedbackListView todo={true}/>
        </div>
      </div>
    );
  }

  renderTags() {
    const tags = this.props.talk.tags;
    if (!tags) {
      return undefined;
    }
    return (
      <div className="ka-tags">
        {
          Object.keys(tags).map(category => {
            return tags[category].map(tag => <span key={category} className={ 'tag tag' + this.tagColors[category] }>{tag}</span>)
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
/*
todo:
  show() {
    // delay the show so that the transition can kick in
    transitionFrom(this.$overlay, 'ka-hidden');
  }

  hide() {
    const $overlay = this.$overlay;
    transitionTo($overlay, 'ka-hidden').then(() => $overlay.parentNode.removeChild($overlay))
  }
*/

};
