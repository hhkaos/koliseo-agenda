import { h, render, Component } from 'preact';
import assert from './assertions';
import fetchMock from 'fetch-mock';
import { initDOM } from './mock/jsdom-init';
import MockContextComponent from './mock/MockContextComponent';
import AgendaCell from '../src/model/AgendaCell';
import MockCell from './mock/MockCell';
import { LikeButton, LoginLogoutButton } from '../src/view/Buttons';
import User from '../src/model/User';
import AgendaActions from '../src/actions/AgendaActions';
import { AUTHENTICATED, ANONYMOUS } from './mock/MockUser';

describe('Buttons', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    fetchMock.post(/likes/, {
      'todo': true
    });

  });

  it('renders for logged in user', () => {
    const cell = new AgendaCell(MockCell);
    render(
      <MockContextComponent currentUser={AUTHENTICATED}>
        <LikeButton cell={cell} />
        <LoginLogoutButton />
      </MockContextComponent>, element
    )
    //assert.react.contains(element, '<button class="ka-button ka-button-secondary">Sign out</button>');
    const likeButton = element.querySelector('.ka-like-link');
    assert(!!likeButton);
    assert(!likeButton.classList.contains('selected'));
    assert.react.contains(element, 'Click to mark this talk as favorite');
    assert.react.contains(element, '<span class="ka-button-indicator">11</span>');
    return AgendaActions.addLike(AUTHENTICATED, cell.contents.id).then(() => {
      assert(likeButton.classList.contains('selected'), 'Liked button is not displaying .selected');
      return AgendaActions.removeLike(AUTHENTICATED, cell.contents.id)
    }).then(() => {
      assert(!likeButton.classList.contains('selected'), 'Liked was removed, but the button is still displaying .selected');
      return AgendaActions.removeLike(AUTHENTICATED, cell.contents.id)
    })
  })

  it('renders for anonymous user', () => {
    const user = new User({ likes: [] })
    render(
      <MockContextComponent currentUser={AUTHENTICATED}>
        <LikeButton cell={new AgendaCell(MockCell)} />
        <LoginLogoutButton />
      </MockContextComponent>, element
    )
    assert.react.contains(element, '<button class="ka-button ka-button-secondary">Sign out</button>');
    return AgendaActions.addLike(AUTHENTICATED, cell.contents.id).then(() => {
      assert(element.querySelector('.ka-like-link').classList.contains('selected'));
    })
  })
  
});
