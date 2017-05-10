import { h, render, Component } from 'preact';
import assert from './assertions';
import KoliseoAPI from '../src/controller/KoliseoAPI';
//import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init'; 
import MockUserContextComponent from './mock/MockUserContextComponent';
import MockCell from './mock/MockCell';
import AgendaCell from '../src/model/AgendaCell';
import { registerMockFetch } from './mock/MockFeedback';
import TalkDialog from '../src/view/TalkDialog';

describe('TalkDialog', () => {

  initDOM();
  let element;

  before(() => {
    registerMockFetch();
  })

  beforeEach(() => {
    // create the element for the test
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders correctly', () => {
    const cell = new AgendaCell(MockCell)
    const tagColors = {
      "Type of Proposal": 1,
      "Language of the talk/workshop": 2,
      "Technology": 3,
      "Language ": 4,
      "Level ": 5
    }
    
    render(
      <MockUserContextComponent>
        <TalkDialog cell={cell} tagColors={tagColors}/>
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, '<div class="ka-dialog"><a class="ka-close" title="close"></a><div class="ka-dialog-contents">');
    assert.react.contains(element, 'Title for talk 1');
  })


});
