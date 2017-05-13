import { h, render, Component } from 'preact';
import assert from './assertions';
import KoliseoAPI from '../src/controller/KoliseoAPI';
import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init';
import User from '../src/model/User';
import { AUTHENTICATED, ANONYMOUS } from './mock/MockUser';
import AvatarView from '../src/view/AvatarView';

describe('AvatarView', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('render user', () => {
    render(<AvatarView user={AUTHENTICATED}/>, element)
    assert.react.contains(element, '<a href="https://www.koliseo.com/foo" class="ka-avatar-a" title="Foo User" style=""><img class="ka-avatar-img"></a>');
  })

  it('render anonymous', () => {
    render(<AvatarView user={ANONYMOUS} />, element)
    assert.react.contains(element, '<span class="ka-avatar-a"><img class="ka-avatar-img" src="data:image/svg+xml;charset=US-ASCII,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=');
  })

  it('renders multiple non-stacked users', () => {
    render(<AvatarView users={[AUTHENTICATED, AUTHENTICATED]} />, element)
    assert.react.contains(element, '<div class="ka-avatars"><a href="https://www.koliseo.com/foo" class="ka-avatar-a" title="Foo User" style="">');
  })

  it('renders multiple stacked users', () => {
    render(<AvatarView users={[AUTHENTICATED, AUTHENTICATED, AUTHENTICATED]} />, element)
    assert.react.contains(element, '<a href="https://www.koliseo.com/foo" class="ka-avatar-container"><img class="ka-avatar-img"></a>');
    assert.react.contains(element, 'KK');
  })

});
