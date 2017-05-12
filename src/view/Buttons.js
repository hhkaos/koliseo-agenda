import { h, render, Component } from 'preact';
import AgendaActions from '../actions/AgendaActions';
import UserActions from '../actions/UserActions';

/**
 * Render the like button 
 * Properties:
 * cell: {AgendaCell}
 * displayLabel: {boolean} true to display the label
 */
export class LikeButton extends Component {

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    
    if (this.context.user.isAnonymous()) {
      return UserActions.login();
    }
    const user = this.user;
    let talkId = +target.dataset.talkId;
    debugger; // todo
  }

  render() {
    const { currentUser } = this.context;
    const { cell, displayLabel } = this.props;
    const liked = currentUser.isLiked(cell.id);
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
      <a className="ka-icon ka-icon-heart"
          title={state.title}
          data-state={state.value}
          onClick={this.onClick}>
          { displayLabel? label : undefined }
      </a>
    )
  }

}

/**
 * Render the login or log out button
 */
export function LoginLogoutButton(props) {
  const user = this.context.currentUser;
  return user.readOnly? undefined :
    user.isAnonymous()? <button className="ka-button">Sign in</button> :
      <button className="ka-button ka-button-secondary">Sign out</button>
}