import { h, render, Component } from 'preact';
import assert from './assertions';
import KoliseoAPI from '../src/controller/KoliseoAPI';
import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init';
import MockContextComponent from './mock/MockContextComponent';
import Feedback from '../src/model/Feedback';
import MockFeedback from './mock/MockFeedback';
import FeedbackInputView from '../src/view/FeedbackInputView';
import { AUTHENTICATED, ANONYMOUS } from './mock/MockUser';

describe('FeedbackInputView', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders for authenticated user', () => {
    render(
      <MockContextComponent>
        <FeedbackInputView />
      </MockContextComponent>, element
    )
    assert.react.contains(element, '<span class="ka-author">Foo User</span><span class="ka-feedback-time">1/1/1970</span></div>');
    assert.react.contains(element, '<p>Foo bar baz</p>');
  })

  it('renders for unauthenticated user', () => {
    const feedback = new Feedback(MockFeedback)
    render(
      <MockContextComponent user={ANONYMOUS}>
        <FeedbackInputView feedback={feedback} />
      </MockContextComponent>, element
    )
    assert.react.contains(element, '<span class="ka-author">Foo User</span><span class="ka-feedback-time">1/1/1970</span></div>');
    assert.react.contains(element, '<p>Foo bar baz</p>');
  })

  it('renders with existing feedback', () => {
    const feedback = new Feedback(MockFeedback)
    render(
      <MockContextComponent>
        <FeedbackInputView currentFeedback={feedback} />
      </MockContextComponent>, element
    )
    assert.react.contains(element, '<span class="ka-author">Foo User</span><span class="ka-feedback-time">1/1/1970</span></div>');
    assert.react.contains(element, '<p>Foo bar baz</p>');
  })

});
