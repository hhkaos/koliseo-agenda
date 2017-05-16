import { h, render, Component } from 'preact';
import assert from './assertions';
import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init';
import { AUTHENTICATED, ANONYMOUS } from './mock/MockUser';
import MockContextComponent from './mock/MockContextComponent';
import { registerMockFetch } from './mock/MockFeedback';
import FeedbackListView from '../src/view/FeedbackListView';
import FeedbackActions from '../src/actions/FeedbackActions';
import AgendaCell from '../src/model/AgendaCell';
import MockCell from './mock/MockCell';
import 'mock-local-storage';

describe('FeedbackListView', () => {

  initDOM();
  let element;
  let cell = new AgendaCell(MockCell);

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    registerMockFetch();
  });

  function mount(currentUser) {
    render(
      <MockContextComponent currentUser={currentUser} feedbackEnabled={true}>
        <FeedbackListView cell={cell} />
      </MockContextComponent>, element
    )
    return FeedbackActions.fetch({ talkId: 5, currentUser });
  }

  it('renders with authenticated user', () => {
    const promise = mount(AUTHENTICATED);
    //assert.react.contains(element, 'loading');
    return promise.then(() => {
      assert.react.contains(element, 'kk');
    })
  })

  it('renders with anonymous user', () => {
    return mount(ANONYMOUS).then(() => {
      assert.react.contains(element, 'kk');
    })
  })

  it('renders with empty list', () => {
    // return a paged response, up to 2 pages
    fetchMock.get(/feedback/, {
      data: []
    });
    return mount(ANONYMOUS).then(() => {
      assert.react.contains(element, 'kk');
    })
  })

  it('renders without OAuthID', () => {
    return mount(ANONYMOUS).then(() => {
      assert.react.contains(element, 'kk');

      // no submit form if there is no OAuth ID
      assert.react.notExists(element, 'form.ka-dialog-section'); 

      // even without OAuth ID it should show existing feedback
      todo();
    })
  })

  it('renders without agenda.feedbackEnabled', () => {
    render(
      <MockContextComponent currentUser={ANONYMOUS} feedbackEnabled={false} >
        <FeedbackListView cell={cell} />
      </MockContextComponent>, element
    )
    assert.react.notExists(element, 'form.ka-dialog-section');
  })

});
