import { h, render, Component } from 'preact';
import User from '../../src/model/User';
import MockUser from './MockUser';

const mockUser = new User(MockUser)

// create a user that gets passed by this.context
export default class MockUserContext extends Component {

  getChildContext() {
    return {
      currentUser: this.props.user || mockUser 
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }

}