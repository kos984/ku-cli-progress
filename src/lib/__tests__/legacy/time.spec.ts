import { Time } from '../../time/time';

describe('time', () => {
  it('should be defined', () => {
    expect(Time).toBeDefined();
  });
  it('should return time', () => {
    const time = new Time();
    expect(time.getTime()).toEqual(expect.any(Number));
  });
});
