import { h, render, Component } from 'preact';
import assert from './assertions';
import KoliseoAPI from '../src/controller/KoliseoAPI';
import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init';
import MockUserContextComponent from './mock/MockUserContextComponent';
import AgendaCell from '../src/model/AgendaCell';
import AgendaDay from '../src/model/AgendaDay';
import MockCell from './mock/MockCell';
import MockDay from './mock/MockDay';
import AgendaCellView from '../src/view/AgendaCellView';

describe('AgendaCellView', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders', () => {
    const cell = new AgendaCell(MockCell)
    const day = new AgendaDay(MockDay);
    render(
      <MockUserContextComponent>
        <AgendaCellView cell={cell} day={day} />
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, 'kk');
  })


});
