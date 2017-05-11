import { h, render, Component } from 'preact';
import assert from './assertions';
import fetchMock from 'fetch-mock';
import { initDOM } from './mock/jsdom-init';
import MockUserContextComponent from './mock/MockUserContextComponent';
import AgendaCell from '../src/model/AgendaCell';
import MockCell from './mock/MockCell';
import AgendaCellView from '../src/view/AgendaCellView';

describe('AgendaCellView', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders talk', () => {
    const cell = new AgendaCell(MockCell)
    render(
      <MockUserContextComponent>
        <AgendaCellView cell={cell} />
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, '<a href="#1/1" data-id="111" class="ka-talk-title">Title for talk 1</a>');
  })

  it('renders extended', () => {
    const cell = new AgendaCell({
      "id": 111,
      "start": "09:00",
      "end": "10:00",
      "contents": {
        "type": "EXTEND",
        "name": "Foobar",
        "trackId": "11",
        "merged": false
      }
    })
    render(
      <MockUserContextComponent>
        <AgendaCellView cell={cell} />
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, '<td class="ka-table-td extend" rowspan="1" colspan="1"><div>Extended from <b>Foobar</b></div></td>');
    
  })

});
