import { USER_JSON } from './MockUser';
import fetchMock from 'fetch-mock';
import range from 'lodash/range';
import KoliseoAPI from '../../src/controller/KoliseoAPI';
import { getUrlParameter } from '../../src/util';

const mockValues = {
  rating: 3.5,
  comment: 'Foo bar baz',
  user: USER_JSON,
  lastModified: 100,
}
export default mockValues;

// mock three different feedback entries
export function registerMockFetch() {
  // init KoliseoAPI with mock values
  if (!KoliseoAPI.c4pUrl) {
    KoliseoAPI.init({ c4pUrl: '/foobar', oauthClientId: 'foobar' });
  }

  // return a paged response, up to 2 pages
  fetchMock.get(/feedback/, (url) => {
    const c = getUrlParameter(url, 'cursor');
    const cursor = c? parseInt(c) : 0;
    return {
      data: range(3).map(id => Object.assign({}, mockValues, {
        id: id + cursor,
        comment: `comment ${id + cursor}`
      })),
      cursor: cursor == 1? undefined : 1
    }
  });

}