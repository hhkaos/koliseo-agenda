import { h, render, Component } from 'preact';
import assert from './assertions';
import { initDOM } from './mock/jsdom-init';
import TagsView from '../src/view/TagsView';

describe('TagsView', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders a list of tags', () => {
    render(
      <TagsView tags={{ 
        'Type of slot ': ['talk'],
        'Languages  in the talk': [ 'Español   (mostly)', 'BorkBorkBork' ]
      }}/>, element
    )
    assert.react.exists(element, '.tag-type-of-slot.tag-type-of-slot--talk');
    assert.react.exists(element, '.tag-languages-in-the-talk--espaol-mostly');
    assert.react.exists(element, '.tag-languages-in-the-talk--borkborkbork');
  })

  it('renders an empty list', () => {
    render(<TagsView />, element)
    assert.equal('', element.innerHTML);
  })

});
