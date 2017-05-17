import { h, render, Component } from 'preact';

/**
 * Injects the context entries
 * user: {User} the current user
 * feedbackEnabled: (boolean} true if feedback for this agenda is enabled 
 */
export default class ContextComponent extends Component {

  getChildContext() {
    const { currentUser, feedbackEnabled } = this.props;
    return {
      currentUser,
      feedbackEnabled
    }
  }

  render() {
    // with Preact, this.props.children is always an array
    return this.props.children[0]
  }

}