import { h, render, Component } from 'preact';
import assert from './assertions';
import KoliseoAPI from '../src/controller/KoliseoAPI';
import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init';
import MockUserContextComponent from './mock/MockUserContextComponent';
import Feedback from '../src/model/Feedback';
import MockFeedback from './mock/MockFeedback';
import StarsView from '../src/view/StarsView';

describe('StarsView', () => {

  initDOM();
  let element;

  before(() => {
    /*
    fetchMock.get(/me/, {
      id: 5,
      name: "User John Doe"
    });
    */
  })

  beforeEach(() => {
    // create the element for the test
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders as read-only', () => {
    const feedback = new Feedback(MockFeedback)
    render(
      <MockUserContextComponent>
        <StarsView feedback={feedback} />
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, '<span class="ka-star-bar" style="width: 70%;">');
    assert.react.notContains(element, '<a data-rating="4" class="ka-star ka-star-4"></a>');
  })

  it('renders correctly for read-write', () => {
    const feedback = new Feedback(MockFeedback)
    render(
      <MockUserContextComponent>
        <StarsView feedback={feedback} editable={true}/>
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, '<a data-rating="4" class="ka-star ka-star-4"></a>');
  })


});
