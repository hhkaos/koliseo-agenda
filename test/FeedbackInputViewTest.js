import { h, render, Component } from 'preact';
import assert from './assertions';
import KoliseoAPI from '../src/controller/KoliseoAPI';
import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init';
import MockUserContextComponent from './mock/MockUserContextComponent';
import Feedback from '../src/model/Feedback';
import MockFeedback from './mock/MockFeedback';
import FeedbackInputView from '../src/view/FeedbackInputView';

describe('FeedbackInputView', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders for authenticated user', () => {
    const feedback = new Feedback(MockFeedback)
    render(
      <MockUserContextComponent>
        <FeedbackInputView feedback={feedback} />
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, '<span class="ka-author">Foo User</span><span class="ka-feedback-time">1/1/1970</span></div>');
    assert.react.contains(element, '<p>Foo bar baz</p>');
  })


});
