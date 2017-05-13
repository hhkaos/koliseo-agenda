import { h, render, Component } from 'preact';
import PropTypes from 'prop-types';

/**
 * Render the avatar
 * 
 * { User } the user data to render. Either this or users must be provided
 * user
 * 
 * { Array of User } Use this attribute to render multiple users
 * users
 */
export default class AvatarView extends Component {

  renderAnonymous(user) {
    return (
      <span className="ka-avatar-a">
        <img className="ka-avatar-img" src={ANONYMOUS_AVATAR} />
      </span>
    )
  }

  onError(e) {
    e.target.src = ANONYMOUS_AVATAR;
  }

  // user: {User} te actual user
  // index: {number} for stacked users, the 0-based index. Must be ;less than stackTotal
  // total: {number} for stacked users, the total number of users to display
  renderUser(user, { index, total } = {}) {
    const style = !total? undefined : {
      left: parseInt((100/total) * index) + '%',
      'z-index': total - index
    }
    const href = this.props.href || 'https://www.koliseo.com/' + user.uuid;
    return (
      <a href={ href } className="ka-avatar-a" title={user.name} onError={this.onError}>
        <img className="ka-avatar-img" src={user.avatar} />
      </a>
    )
  }

  // render a list of users. For more than two users, will start to distribute speakers horizontally, stacking them
  renderUsers(users) {
    const stacked = users.length > 2;

    return (
      <div className={"ka-avatars" + (stacked? " stacked" : "")}>
        { users.map((user, index) => this.renderUser(user, !stacked? undefined : {
          index, total: users.length
        })) }
      </div>
    )
    return this.renderUser(users[0]);
  }

  render() {
    const { user, users } = this.props;
    return users? this.renderUsers(users) :
      user.isAnonymous()? this.renderAnonymous(user) : 
      this.renderUser(user);
  }

}

const ANONYMOUS_AVATAR = 'data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0C22.386 0 0 22.386 0 50c0 12.965 4.938 24.774 13.03 33.658 2.58-1.666 7.498-4.12 16.882-7.346 2.026-.696 2.52-3.402 5.356-3.04 2.836.362-.984-3.362 3.105-2.786 0 0 .256-7.68 0-8.942-.256-1.26-.374-2.654-.295-3.08 0 0-2.52 1.19-4.096-3.496-1.575-4.686-2.087-9.885-.827-10.632 1.26-.748 1.843-.04 2.284.394 0 0-2.324-10.633.196-14.965 2.52-4.332 6.38-7.167 10.71-8.506 4.333-1.34 7.01-2.05 9.453-1.42 2.44.63 7.336 2.127 11.662 6.538 4.325 4.41 3.93 8.428 3.773 12.444-.158 4.017-.788 6.93-.788 6.93s3.78-3.937 3.466 2.732c-.315 6.668-3.308 11.09-6.09 9.98 0 0-.25 1.663-.723 2.805-.472 1.14-.55 9.725-.315 11.498 0 0 2.166-.59 2.048 1.142-.118 1.733-.17 1.194 1.93 1.457 2.1.263 2.454-.295 4.9 2.88 2.444 3.176 4.44 1.193 10.7 5.435.12.08.232.17.343.26C94.956 75.03 100 63.105 100 50c0-27.614-22.386-50-50-50" fill="#5ec2dd"/><path d="M52.14 81.89l-32.205 8.057c8.236 6.208 18.45 9.93 29.533 10.047.177 0 .354.006.532.006.248 0 .494-.006.74-.01 12.428-.18 23.757-4.893 32.41-12.562 1.242-1.102 2.428-2.266 3.556-3.485 5.83-6.3 10.057-14.105 12.036-22.766L68.41 27.43 52.14 81.89z" fill="#42b1cf"/><path d="M75.663 78.248c-2.446-3.176-2.8-2.618-4.9-2.88-2.1-.264-2.05.274-1.93-1.458.118-1.733-2.048-1.142-2.048-1.142-.236-1.772-.157-10.357.315-11.5.473-1.14.722-2.803.722-2.803 2.783 1.108 5.776-3.313 6.09-9.98.316-6.67-3.465-2.732-3.465-2.732s.63-2.914.788-6.93c.158-4.017.55-8.034-3.773-12.445-4.326-4.41-9.222-5.907-11.664-6.537-2.44-.63-5.12.08-9.45 1.42-4.333 1.338-8.192 4.173-10.712 8.505-2.52 4.33-.197 14.965-.197 14.965-.442-.433-1.025-1.142-2.285-.394-1.26.748-.748 5.946.827 10.632 1.575 4.687 4.096 3.497 4.096 3.497-.08.426.04 1.82.295 3.08.256 1.26 0 8.94 0 8.94-4.09-.575-.27 3.15-3.105 2.787-2.835-.362-3.33 2.344-5.356 3.04-9.384 3.226-14.303 5.68-16.88 7.346 1.19 1.305 2.445 2.55 3.765 3.722 8.707 7.74 20.135 12.482 32.67 12.613.178.002.355.007.533.007.248 0 .494-.006.74-.01 12.428-.18 23.757-4.893 32.41-12.562 1.242-1.102 2.428-2.266 3.556-3.485-.11-.092-.224-.18-.344-.26-6.26-4.242-8.255-2.26-10.7-5.435" fill="#2c6582"/></svg>';
