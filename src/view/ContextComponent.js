import { h, render, Component } from 'preact';

/**
 * Injects the context entries
 * user: {User} the current user
 * tagColors: {JSON of tagCategory, colorIndex} a JSON dictionary with the CSS class name corresponding to each tag category
 * feedbackEnabled: (boolean} true if feedback for this agenda is enabled 
 */
export default class ContextComponent extends Component {

  getChildContext() {
    const { currentUser, feedbackEnabled, tagColors } = this.props;
    return {
      currentUser,
      feedbackEnabled,
      tagColors,
    }
  }

  render() {
    // with Preact, this.props.children is always an array
    return this.props.children[0]
  }

}