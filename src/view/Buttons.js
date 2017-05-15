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
    const { cell, displayLabel, className = '' } = this.props;
    const { totalLikes } = cell.contents;
    const liked = currentUser.isLiked(cell.id);
    const state = liked? {
      value: 'selected',
      title: 'I am planning to attend this talk',
      label: `Liked`
    } : {
      value: 'default',
      title: `Click to mark this talk as favorite (currently ${totalLikes})`,
      label: `Like`
    };
    return (
      <a 
        title={state.title}
        data-state={state.value}
        onClick={this.onClick}
        className={ "ka-social-link ka-like-link ka-button-with-indicator " + className}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={"ka-icon with-label " + state.value} 
          viewBox="0 -10 110.669 106.234">
          <path className="ka-icon-heart" d="M110.67 30c0-16.57-13.38-30-29.887-30-10.778 0-20.19 5.746-25.45 14.333C50.078 5.746 40.66 0 29.884 0 13.376 0 0 13.43 0 30c0 9.02 3.982 17.09 10.258 22.587L52.608 95.1c.722.726 1.703 1.134 2.726 1.134s2.004-.408 2.728-1.134l42.348-42.513C106.687 47.09 110.67 39.02 110.67 30z" />
        </svg>
        <span className="ka-button-label">{state.label}</span>
        <span className="ka-button-indicator">{totalLikes}</span>
      </a>
    )
  }

}

function signIn(e) {
  UserActions.login();
}

function signOut(e) {
  UserActions.logout();
}


/**
 * Render the login or log out button
 */
export function LoginLogoutButton(props) {
  const user = this.context.currentUser;
  return user.readOnly? undefined :
        user.isAnonymous()? 
          <button className="ka-button" onClick={signIn}>Sign in</button> :
          <button className="ka-button" onClick={signOut}>Sign out</button>;
}