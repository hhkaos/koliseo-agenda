import { h, render, Component } from 'preact';
import assert from './assertions';
import { initDOM } from './mock/jsdom-init';
import TagStylesView from '../src/view/TagStylesView';

describe('TagStylesView', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders a bunch of styles', () => {
    render(
      <TagStylesView tagCategories={{
        'Type of slot ': {
            tags: ['talk', 'workshop']
        },
        'Languages  in the talk': {
          tags: ['Español   (mostly)', 'English']
        }
      }} />, element
    )
    assert.equal(element.innerHTML, '<style>.tag-type-of-slot {background-color:#008cba;border-color:#00698c;}.tag-languages-in-the-talk {background-color:#e65100;border-color:#ad3d00;}</style>');
  })

});
