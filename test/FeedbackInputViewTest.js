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
    const feedback = new Feedback(MockFeedback)
    render(
      <MockContextComponent>
        <FeedbackInputView currentFeedback={feedback} />
      </MockContextComponent>, element
    )
    assert.react.contains(element, '<a href="https://www.koliseo.com/foo" class="ka-avatar-a" title="Foo User"><img class="ka-avatar-img"></a>');
    assert.react.contains(element, '<div class="ka-form-username">Foo User</div>');
    assert.react.contains(element, '<p>Foo bar baz</p>');
  })

  it('renders for unauthenticated user', () => {
    const feedback = new Feedback(Object.assign({}, MockFeedback, { user: ANONYMOUS }));
    render(
      <MockContextComponent currentUser={ANONYMOUS}>
        <FeedbackInputView feedback={feedback} />
      </MockContextComponent>, element
    )
    assert.react.contains(element, '<span class="ka-avatar-a"><img class="ka-avatar-img" src="data:image/svg+xml');
    assert.react.contains(element, 'You must sign in to provide feedback');
  })

  it('renders with existing feedback', () => {
    const feedback = new Feedback(MockFeedback)
    render(
      <MockContextComponent>
        <FeedbackInputView currentFeedback={feedback} />
      </MockContextComponent>, element
    )
    assert.react.contains(element, '<div class="ka-form-username">Foo User</div>');
    assert.react.contains(element, '<div class="ka-star-rating"><span class="ka-star-bar" style="width: 70%;"></span>');
    assert.react.contains(element, '<textarea class="ka-feedback-comment" placeholder="Share your thoughts" maxlength="255"></textarea>');
  })

  it('renders alert message', () => {
    const feedback = new Feedback(MockFeedback)
    Object.assign(feedback, { 
      rating: 1, 
      comments: '' 
    });
    render(
      <MockContextComponent>
        <FeedbackInputView currentFeedback={feedback} message={{
          message: 'foobar',
          level: 'alert'
        }}/>
      </MockContextComponent>, element
    )
    
    assert.react.contains(element, 'disabled');
    assert.react.contains(element, 'alert');
  })

});
