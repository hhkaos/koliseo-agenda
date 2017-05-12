import { h, render, Component } from 'preact';

/**
 * Injects the current user as a context entry
 * user: {User} the current user. Will be propagated to children components through context
 */
export default class UserContextComponent extends Component {

  getChildContext() {
    return {
      currentUser: this.props.currentUser
    }
  }

  render() {
    // in preact, children is always an aray
    return this.props.children[0]
  }

}