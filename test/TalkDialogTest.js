import { h, render, Component } from 'preact';
import assert from './assertions';
import KoliseoAPI from '../src/controller/KoliseoAPI';
import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init'; 
import MockUserContextComponent from './mock/MockUserContextComponent';
import AgendaCell from '../src/model/AgendaCell';
import MockCell from './mock/MockCell';
import TalkDialog from '../src/view/TalkDialog';

describe('TalkDialog', () => {

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

  it('renders correctly', () => {
    const cell = new AgendaCell(MockCell)
    render(
      <MockUserContextComponent>
        <TalkDialog talk={cell} />
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, 'kk');
  })


});
