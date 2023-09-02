import { Progress } from '../progress';
import { Eta } from '../eta';

describe('progress', () => {
  it('should init correct', () => {
    const progress = new Progress({ total: 100 });
    expect(progress.getProgress()).toBe(0);
    expect(progress.getEta()).toBeInstanceOf(Eta);
    expect(progress.getValue()).toBe(0);
    expect(progress.getPayload()).toBeUndefined();
    expect(progress.getTag()).toBe(undefined);
    expect(progress.getTotal()).toBe(100);
  });

  it('should emit message after update', async () => {
    const progress = new Progress({ total: 100 });
    let message;
    const listener = e => message = e;
    progress.on('update', listener);
    progress.increment();
    expect(message).toMatchObject({
      prev: {
        value: 0,
        payload: {}
      },
      new: {
        value: 1,
        payload: {},
      },
      total: 100,
    });
    progress.emitter.removeListener('update', listener);
    expect(progress.emitter.listenerCount('update')).toBe(0);
  });
  it('update payload', () => {
    const progress = new Progress({ total: 100 });
    expect(progress.getPayload()).toBeUndefined();
    progress.increment(1, { foo: 'bar' });
    expect(progress.getPayload()).toMatchObject({ foo: 'bar' });
    progress.set(0, { foo: 'barBar' });
    expect(progress.getPayload()).toMatchObject({ foo: 'barBar' });
  });
  it('set should should works correct', () => {
    const progress = new Progress({ total: 100, eta: {
        set: jest.fn(),
        getEtaS: jest.fn(),
        getSpeed: jest.fn(),
        update: jest.fn(),
        getDurationMs: jest.fn(),
      }},
    );
    progress.set(50);
    expect(progress.getPayload()).toMatchObject({});
    expect(progress.getValue()).toBe(50);
  });
  describe('getProgress', () => {
    it('0%', () => {
      const progress = new Progress({ total: 100, start: 0 });
      expect(progress.getProgress()).toBe(0);
    });
    it('50%', () => {
      const progress = new Progress({ total: 100, start: 50 });
      expect(progress.getProgress()).toBe(0.5);
    });
    it('100%', () => {
      const progress = new Progress({ total: 100, start: 0 });
      progress.increment(100);
      expect(progress.getProgress()).toBe(1);
    });
    it('> 100%', () => {
      const progress = new Progress({ total: 100, start: 0 });
      progress.increment(100);
      progress.increment(100);
      expect(progress.getProgress()).toBe(1);
    });
  });
  describe('getPayload', () => {
    it('without init', () => {
      const progress = new Progress({ total: 100, start: 0 });
      expect(progress.getPayload()).toBeUndefined();
    });
    it('with init', () => {
      const progress = new Progress({ total: 100, start: 0 }, {
        foo: 'bar',
      });
      expect(progress.getPayload()).toEqual({ foo: 'bar' });
    });
    it('update payload', () => {
      const progress = new Progress<{ foo: string }>({ total: 100, start: 0 }, {
        foo: 'bar',
      });
      progress.increment(undefined, { foo: 'baz' });
      expect(progress.getValue()).toBe(1);
      expect(progress.getPayload()).toEqual({ foo: 'baz' });
    });
    it('should not update payload to undefined', () => {
      const progress = new Progress<{ foo: string }>({ total: 100, start: 0 }, {
        foo: 'bar',
      });
      progress.increment(undefined, undefined);
      expect(progress.getPayload()).toEqual({ foo: 'bar' });
      progress.increment();
      expect(progress.getPayload()).toEqual({ foo: 'bar' });
    });
  });
  it('tag', () => {
    const progress = new Progress<{ foo: string }>({ total: 100, start: 0, tag: 'RED' });
    expect(progress.getTag()).toBe('RED');
  });
});
