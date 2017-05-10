import { h, render, Component } from 'preact';
import PropTypes from 'prop-types';

/**
 * Render the avatar
 */
export default class AvatarView extends Component {

  renderAnonymous(user) {
    return (
      <span className="ka-avatar-container">
        <img className="ka-avatar-img" src="https://www.koliseo.com/less/img/avatar.gif" />
      </span>
    )
  }

  renderUser(user) {
    return (
      <a href={ 'https://www.koliseo.com/' + user.uuid } className="ka-avatar-container">
        <img className="ka-avatar-img" src={user.avatar} />
      </a>
    )
  }

  render() {
    const user = this.props.user;
    return user.isAnonymous()? this.renderAnonymous(user) : this.renderUser(user);
  }

}

AvatarView.propTypes = {
  // { User } the user data to render
  user: PropTypes.object.isRequired
}