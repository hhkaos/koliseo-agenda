import { h, render, Component } from 'preact';
import assert from './assertions';
import fsp from 'fs-promise';
import path from 'path';
import fetchMock from 'fetch-mock';
//import 'mock-local-storage';
import { initDOM } from './mock/jsdom-init';
import FilterView from '../src/view/FilterView';
import CallForPapers from '../src/model/CallForPapers';
import FilterActions from '../src/actions/FilterActions';
import AgendaStore from '../src/stores/AgendaStore'; 
import AltContainer from 'alt-ng/AltContainer';

describe('FilterView', () => {

  initDOM();
  let element;
  let c4p;

  before(() => {
    return fsp.readFile(path.resolve('test/json/c4p.json')).then((c4pContents) => {
      c4p = new CallForPapers(JSON.parse(c4pContents.toString()));
    })
  });

  beforeEach(() => {
    // create the element for the test
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders', () => {
    render(
      <AltContainer store={AgendaStore}>
        <FilterView 
          tagCategories={c4p.tagCategories}
        />
      </AltContainer>
      , element
    );
    assert.react.contains(element, '<legend>Type of Proposal</legend>');
    assert.react.contains(element, '<legend>Type of Proposal</legend>');
    FilterActions.toggleFilterTag({ category: 'Language ', tag: 'Bash' });
    assert.equal('{"filter":{"tags":{"Language ":["Bash"]}}}', JSON.stringify(AgendaStore.getState()));
    assert.equal("tag tag-language tag-language--bash selected", element.querySelector('.tag-language--bash').className);
  })


});
