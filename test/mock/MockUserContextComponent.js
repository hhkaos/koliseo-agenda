import { h, render, Component } from 'preact';
import { AUTHENTICATED } from './MockUser';

// create a user that gets passed by this.context
export default class MockUserContext extends Component {

  getChildContext() {
    return {
      currentUser: this.props.user || AUTHENTICATED 
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }

}