import { h, render, Component } from 'preact';
import assert from './assertions';
import KoliseoAPI from '../src/controller/KoliseoAPI';
import fetchMock from 'fetch-mock';
import { URL, initDOM } from './mock/jsdom-init';
import User from '../src/model/User';
import MockUser from './mock/MockUser';
import AvatarView from '../src/view/AvatarView';

describe('AvatarView', () => {

  initDOM();
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  it('render user', () => {
    const user = new User(MockUser)
    render(<AvatarView user={user}/>, element)
    assert.react.contains(element, '<a href="https://www.koliseo.com/foo" class="ka-avatar-container"><img class="ka-avatar-img"></a>');
  })

  it('render anonymous', () => {
    const user = new User({})
    render(<AvatarView user={user} />, element)
    assert.react.contains(element, '<span class="ka-avatar-container"><img class="ka-avatar-img" src="https://www.koliseo.com/less/img/avatar.gif"></span>');
  })

});
