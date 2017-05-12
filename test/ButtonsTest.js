import { h, render, Component } from 'preact';
import assert from './assertions';
import fetchMock from 'fetch-mock';
import { initDOM } from './mock/jsdom-init';
import MockUserContextComponent from './mock/MockUserContextComponent';
import AgendaCell from '../src/model/AgendaCell';
import MockCell from './mock/MockCell';
import { LikeButton, LoginLogoutButton } from '../src/view/Buttons';
import User from '../src/model/User';

describe('Buttons', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('renders for logged in user', () => {
    render(
      <MockUserContextComponent>
        <LikeButton cell={new AgendaCell(MockCell)} />
        <LoginLogoutButton />
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, '<a class="ka-icon ka-icon-heart" title="Click to mark this talk as favorite" data-state="default"></a>');
    assert.react.contains(element, '<button class="ka-button ka-button-secondary">Sign out</button>');
  })

  it('renders for anonymous user', () => {
    const user = new User({ likes: [] })
    render(
      <MockUserContextComponent>
        <LikeButton cell={new AgendaCell(MockCell)} />
        <LoginLogoutButton />
      </MockUserContextComponent>, element
    )
    assert.react.contains(element, '<button class="ka-button ka-button-secondary">Sign out</button>');
  })
  
});
