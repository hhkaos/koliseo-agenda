export default class AvatarView {

  constructor(user) {
    this.user = user;
  }

  renderAnonymous() {
    return `
      <span class="ka-avatar-container">
        <img class="ka-avatar-img" src="https://www.koliseo.com/less/img/avatar.gif">
      </span>`
  }

  renderUser(user) {
    return `
      <a href="https://www.koliseo.com/${user.uuid}" class="ka-avatar-container">
        <img class="ka-avatar-img" src="${user.avatar}">
      </a>`
  }

  render() {
    const user = this.user;
    return user.isAnonymous()? this.renderAnonymous() : this.renderUser(user);
  }

}