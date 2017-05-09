import { h, render, Component } from 'preact';
import AgendaActions from '../actions/AgendaActions';
import UserActions from '../actions/UserActions';

/**
 * Render the like button 
 * Properties:
 * talk: {Talk}
 * user: {User} the current user
 * displayLabel: {boolean} true to display the label
 */
export default class LikeButton extends Component {

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    
    if (this.props.user.isAnonymous()) {
      return UserActions.login();
    }
    const user = this.user;
    let talkId = +target.dataset.talkId;
    debugger; // todo
  }

  render() {
    const { user, talk, displayLabel } = this.props;
    const liked = user.isLiked(talk.id);
    const state = liked? {
      value: 'selected',
      title: 'I am planning to attend this talk',
      label: 'Liked'
    } : {
      value: 'default',
      title: 'Click to mark this talk as favorite',
      label: 'Like'
    };
    return (
      <span className="ka-like-container">
        <a className="ka-like icon-heart"
            title={state.title}
            data-state={state.value}
            onClick={this.onClick}>
            { displayLabel? label : undefined }
        </a>
      </span>
    )
  }

}