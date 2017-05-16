import { h, render, Component } from 'preact';
import { AUTHENTICATED } from './MockUser';
import ContextComponent from '../../src/view/ContextComponent'

// create a user that gets passed by this.context
export default class MockContextComponent extends ContextComponent {

}

MockContextComponent.defaultProps = {
  currentUser: AUTHENTICATED,
  feedbackEnabled: true,
  tagColors: {
    // todo
    'foo': 2
  }
}