import { Bar, Progress, BarItem, ITerminal } from '../../';

// eslint-disable-next-line max-statements
describe('Bar', () => {
  const mockTerminal = {
    clear: jest.fn(),
    refresh: jest.fn(),
    cursor: jest.fn(),
    write: jest.fn((str: string) => undefined),
  };

  const refreshTimeMs = 5;
  const barOptions = { refreshTimeMs };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use default terminal if not send any', () => {
    const bar = new Bar();
    expect((bar as Bar & { terminal: ITerminal }).terminal).toBeDefined();
  });

  it('bar start without updates', async () => {
    const bar = new Bar(mockTerminal);
    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress));
    bar.start();
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
    ]);
  });

  it('should clear and refresh terminal', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    bar.clean();
    bar.refresh();
    expect(mockTerminal.clear).toBeCalledTimes(1);
    expect(mockTerminal.refresh).toBeCalledTimes(1);
  });

  it('bar start with updates', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress));
    bar.start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
    ]);
  });

  it('should be able remove progress', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    const progressToRemove = new Progress({ total: 200, start: 50 });
    bar.add(new BarItem(progress)).add(new BarItem(progressToRemove)).start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.removeByProgress(progressToRemove);
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n' +
          '[==========------------------------------] 25% ETA: ∞ speed: 0/s duration: 0s 50/200\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n' +
          '[==========------------------------------] 25% ETA: ∞ speed: 0/s duration: 0s 50/200\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
    ]);
  });

  it('should be able remove by progress', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    const progressToRemove = new Progress({ total: 200, start: 50 });
    const barItemToRemove = new BarItem(progressToRemove);
    const barItemToRemove2 = new BarItem([]);
    bar.addProgress(progress).add(barItemToRemove).start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.remove(barItemToRemove);
    bar.remove(barItemToRemove2);
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n' +
          '[==========------------------------------] 25% ETA: ∞ speed: 0/s duration: 0s 50/200\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n' +
          '[==========------------------------------] 25% ETA: ∞ speed: 0/s duration: 0s 50/200\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
    ]);
  });

  it('should be able add new process', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    const progressToAdd = new Progress({ total: 200, start: 50 });
    bar.add(new BarItem(progress)).start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.add(new BarItem(progressToAdd));
    progressToAdd.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n' +
          '[==========------------------------------] 26% ETA: ∞ speed: 0/s duration: 0s 51/200\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n' +
          '[==========------------------------------] 26% ETA: ∞ speed: 0/s duration: 0s 51/200\n',
      ],
    ]);
  });
  it('logWrap', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress)).start();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.logWrap(() => {
      mockTerminal.write('some log');
    });
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
      ['some log'],
      [
        '[----------------------------------------] 1% ETA: ∞ speed: 0/s duration: 0s 1/100\n',
      ],
    ]);
  });
  it('should not render bar if not started', async () => {
    const bar = new Bar(mockTerminal, barOptions);
    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress)).start();
    progress.increment();
    progress.increment();
    progress.increment();
    await new Promise(resolve => setTimeout(resolve, refreshTimeMs * 2));
    bar.stop();
    expect(mockTerminal.write.mock.calls).toEqual([
      [
        '[----------------------------------------] 0% ETA: ∞ speed: 0/s duration: 0s 0/100\n',
      ],
      [
        '[=---------------------------------------] 3% ETA: ∞ speed: 0/s duration: 0s 3/100\n',
      ],
      [
        '[=---------------------------------------] 3% ETA: ∞ speed: 0/s duration: 0s 3/100\n',
      ],
    ]);
  });
  it('isStarted', () => {
    const bar = new Bar();
    expect(bar.isStarted()).toBeFalsy();
    bar.start();
    expect(bar.isStarted()).toBeTruthy();
  });
  it('start with refresh', async () => {
    const bar = new Bar();
    expect(
      (bar as never as { refreshInterval: unknown }).refreshInterval,
    ).toBeUndefined();
    const spy = jest.spyOn(bar, 'render');
    bar.start(10);
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(
      (bar as never as { refreshInterval: unknown }).refreshInterval,
    ).toBeDefined();
    bar.stop();
    const calls = spy.mock.calls.length;
    expect(calls).toBeGreaterThanOrEqual(2);
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(spy.mock.calls.length).toEqual(calls);
    expect(
      (bar as never as { refreshInterval: unknown }).refreshInterval,
    ).toMatchObject({
      _destroyed: true,
    });
  });
  it('wrap logger', () => {
    const logger = {
      level: 'info',
      info: jest.fn(),
    };
    const terminalMock = {
      clear: jest.fn(),
      cursor: jest.fn(),
      refresh: jest.fn(),
      write: jest.fn(),
    };
    const bar = new Bar(terminalMock);
    const clear = jest.spyOn(bar, 'clean');
    const refresh = jest.spyOn(bar, 'refresh');
    const wrappedLogger = bar.wrapLogger(logger);
    expect(terminalMock.clear).toBeCalledTimes(0);
    expect(terminalMock.refresh).toBeCalledTimes(0);
    wrappedLogger.info('test');
    expect(wrappedLogger.level).toEqual('info');
    expect(wrappedLogger[Symbol('test')]).toBeUndefined();
    expect(logger.info).toBeCalledWith('test');
    expect(terminalMock.clear).toBeCalledTimes(1);
    expect(terminalMock.refresh).toBeCalledTimes(1);
  });

  it('should use custom shutdown listener when provided', () => {
    const mockShutdownListener = {
      attach: jest.fn().mockReturnThis(),
      detach: jest.fn().mockReturnThis(),
    };
    const bar = new Bar(mockTerminal, {
      refreshTimeMs: 300,
      shutdownListener: mockShutdownListener,
    });
    expect(
      (bar as unknown as { shutdownListener: unknown }).shutdownListener,
    ).toBe(mockShutdownListener);
  });

  it('should create default shutdown listener when enableCursorOnShutdown is true', () => {
    const bar = new Bar(mockTerminal, {
      refreshTimeMs: 300,
      enableCursorOnShutdown: true,
    });
    expect(
      (bar as unknown as { shutdownListener: unknown }).shutdownListener,
    ).toBeDefined();
    expect(
      (bar as unknown as { shutdownListener: { isAttached: boolean } })
        .shutdownListener.isAttached,
    ).toBe(true);
  });

  it('should not create shutdown listener when enableCursorOnShutdown is false', () => {
    const bar = new Bar(mockTerminal, {
      refreshTimeMs: 300,
      enableCursorOnShutdown: false,
    });
    expect(
      (bar as unknown as { shutdownListener?: unknown }).shutdownListener,
    ).toBeUndefined();
  });

  it('should call terminal.cursor(true) in shutdown listener cleanup function', () => {
    const bar = new Bar(mockTerminal, {
      refreshTimeMs: 300,
      enableCursorOnShutdown: true,
    });

    const shutdownListener = (
      bar as unknown as { shutdownListener: { cleanupFunction: () => void } }
    ).shutdownListener;
    expect(shutdownListener).toBeDefined();

    // Call the cleanup function to test line 41 coverage
    shutdownListener.cleanupFunction();

    expect(mockTerminal.cursor).toHaveBeenCalledWith(true);
  });

  it('should render without newline when addNewLineAfterProgress is false', () => {
    const bar = new Bar(mockTerminal, {
      refreshTimeMs: 300,
      addNewLineAfterProgress: false,
    });

    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress));

    bar.render();

    // Should not add newline at the end
    expect(mockTerminal.write).toHaveBeenCalledWith(
      expect.stringMatching(
        /\[.*\] 0% ETA: ∞ speed: 0\/s duration: 0s 0\/100$/,
      ),
    );
  });

  it('should disable cursor when disableCursor is true in start', () => {
    const bar = new Bar(mockTerminal, {
      refreshTimeMs: 300,
      disableCursor: true,
    });

    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress));

    bar.start();

    expect(mockTerminal.cursor).toHaveBeenCalledWith(false);
  });

  it('should enable cursor when disableCursor is true in stop', () => {
    const bar = new Bar(mockTerminal, {
      refreshTimeMs: 300,
      disableCursor: true,
    });

    const progress = new Progress({ total: 100 });
    bar.add(new BarItem(progress));

    bar.start();
    bar.stop();

    expect(mockTerminal.cursor).toHaveBeenCalledWith(true);
  });
});
