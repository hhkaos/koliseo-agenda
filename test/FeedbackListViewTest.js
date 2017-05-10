import { h, render, Component } from 'preact';
import assert from './assertions';
import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init';
import MockUserContextComponent from './mock/MockUserContextComponent';
import { registerMockFetch } from './mock/MockFeedback';
import FeedbackListView from '../src/view/FeedbackListView';
import FeedbackActions from '../src/actions/FeedbackActions';

describe('FeedbackListView', () => {

  initDOM();
  let element;

  before(() => {
    registerMokcFetch();
  })

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders', () => {
    render(
      <MockUserContextComponent>
        <FeedbackListView cellId={5} />
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, '<div class="ka-feedback-entries"></div>');
    return FeedbackActions.fetch({ cellId: 5 }).then(() => {
      assert.react.contains(element, 'kk');      
    })
  })


});
