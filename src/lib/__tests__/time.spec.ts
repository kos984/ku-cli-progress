import { getTime } from '../time';

describe('time', () => {
  it('should return time', () => {
    expect(getTime()).toEqual(expect.any(Number));
  });
});
