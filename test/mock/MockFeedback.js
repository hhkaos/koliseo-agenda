import { USER_JSON } from './MockUser';
import fetchMock from 'fetch-mock';
import range from 'lodash/range';

const mockValues = {
  rating: 3.5,
  comment: 'Foo bar baz',
  user: USER_JSON,
  lastModified: 100,
}
export default mockValues;

// mock three different feedback entries
export function registerMockFetch() {
  fetchMock.get(/feedback/, {
    data: range(3).map(id => {
      return Object.assign({}, mockValues, {
        id,
        comment: `coment ${id}`
      });
    })
  });

}