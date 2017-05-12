import User from '../../src/model/User';

export const USER_JSON = {
  id: 1,
  uuid: 'foo',
  name: 'Foo User',
  likes: []
}

export const AUTHENTICATED = new User(USER_JSON)

export const ANONYMOUS = new User({ likes: []});