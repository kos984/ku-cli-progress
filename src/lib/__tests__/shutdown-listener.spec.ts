import { EventEmitter } from 'events';
import {
  IShutdownListenerProcess,
  ShutdownListener,
} from '../shutdown-listener/shutdown-listener';
import * as process from 'node:process';

type MockProcess = IShutdownListenerProcess & {
  on: jest.Mock;
  removeListener: jest.Mock;
  kill: jest.Mock;
};

describe('ShutdownListener', () => {
  let mockProcess: MockProcess;
  let cleanupFunction: jest.Mock;

  beforeEach(() => {
    cleanupFunction = jest.fn();
    mockProcess = {
      on: jest.fn(),
      removeListener: jest.fn(),
      kill: jest.fn(),
      pid: 12345,
    } as MockProcess;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default signals', () => {
      const listener = new ShutdownListener({
        cleanupFunction,
      });
      expect((listener as unknown as { signals: string[] }).signals).toEqual([
        'SIGINT',
        'SIGTERM',
      ]);
      expect((listener as unknown as { process: unknown }).process).toBe(
        process,
      );
      expect(
        (listener as unknown as { cleanupFunction: unknown }).cleanupFunction,
      ).toBe(cleanupFunction);
    });

    it('should remove listeners in error happen in clientUp function', async () => {
      const mockTestProcess: EventEmitter & { kill: jest.Mock; pid: unknown } =
        new EventEmitter() as EventEmitter & { kill: jest.Mock; pid: unknown };
      mockTestProcess.kill = jest.fn();
      mockTestProcess.pid = 1;

      const signal = 'TEST_SIGNAL';
      const listener = new ShutdownListener({
        signals: [signal],
        process: mockTestProcess as unknown as IShutdownListenerProcess,
        cleanupFunction: () => {
          throw new Error('Test Error');
        },
      });
      // Wrap the original handler to catch errors
      let resolve: (value: unknown) => void;
      const promise = new Promise(res => {
        resolve = res;
      });
      const listenerWithHandler = listener as unknown as {
        handler: (...params: unknown[]) => Promise<unknown>;
      };
      const handler = listenerWithHandler.handler;
      listenerWithHandler.handler = async (sig: string) => {
        try {
          await handler(sig);
          return resolve(undefined);
        } catch (e) {
          return resolve(e);
        }
      };
      listener.attach();
      expect(mockTestProcess.listeners(signal).length).toBe(1);
      mockTestProcess.emit(signal, signal);
      const err = await promise;
      expect(mockTestProcess.listeners(signal).length).toBe(0);
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe('Test Error');
    });

    it('should initialize with custom signals and process', () => {
      const customSignals = ['SIGUSR1', 'SIGUSR2'];
      const listener = new ShutdownListener({
        signals: customSignals,
        cleanupFunction,
        process: mockProcess,
      });
      expect((listener as unknown as { signals: string[] }).signals).toEqual(
        customSignals,
      );
      expect((listener as unknown as { process: unknown }).process).toBe(
        mockProcess,
      );
    });
  });

  describe('attach', () => {
    it('should attach signal listeners', () => {
      const listener = new ShutdownListener({
        cleanupFunction,
        process: mockProcess,
      });

      listener.attach();

      expect(mockProcess.on).toHaveBeenCalledWith(
        'SIGINT',
        expect.any(Function),
      );
      expect(mockProcess.on).toHaveBeenCalledWith(
        'SIGTERM',
        expect.any(Function),
      );
      expect((listener as unknown as { isAttached: boolean }).isAttached).toBe(
        true,
      );
    });

    it('should not attach if already attached', () => {
      const listener = new ShutdownListener({
        cleanupFunction,
        process: mockProcess,
      });

      listener.attach();
      mockProcess.on.mockClear();
      listener.attach();

      expect(mockProcess.on).not.toHaveBeenCalled();
    });

    it('should return this for chaining', () => {
      const listener = new ShutdownListener({
        cleanupFunction,
        process: mockProcess,
      });

      const result = listener.attach();
      expect(result).toBe(listener);
    });
  });

  describe('detach', () => {
    it('should detach signal listeners', () => {
      const listener = new ShutdownListener({
        cleanupFunction,
        process: mockProcess,
      });

      listener.attach();
      listener.detach();

      expect(mockProcess.removeListener).toHaveBeenCalledWith(
        'SIGINT',
        expect.any(Function),
      );
      expect(mockProcess.removeListener).toHaveBeenCalledWith(
        'SIGTERM',
        expect.any(Function),
      );
      expect((listener as unknown as { isAttached: boolean }).isAttached).toBe(
        false,
      );
    });

    it('should not detach if signal already received', () => {
      const listener = new ShutdownListener({
        cleanupFunction,
        process: mockProcess,
      });

      listener.attach();
      (listener as unknown as { isSignalReceived: boolean }).isSignalReceived =
        true;
      mockProcess.removeListener.mockClear();

      listener.detach();

      expect(mockProcess.removeListener).not.toHaveBeenCalled();
    });

    it('should return this for chaining', () => {
      const listener = new ShutdownListener({
        cleanupFunction,
        process: mockProcess,
      });

      const result = listener.detach();
      expect(result).toBe(listener);
    });
  });

  describe('signal handling', () => {
    it('should handle signal and call cleanup function', async () => {
      const listener = new ShutdownListener({
        cleanupFunction,
        process: mockProcess,
      });

      listener.attach();

      // Get the handler function that was registered
      const handler = mockProcess.on.mock.calls[0][1];

      // Call the handler
      handler('SIGINT');

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(cleanupFunction).toHaveBeenCalled();
      expect(mockProcess.removeListener).toHaveBeenCalled();
      expect(mockProcess.kill).toHaveBeenCalledWith(12345, 'SIGINT');
    });

    it('should not handle signal if already received', async () => {
      const listener = new ShutdownListener({
        cleanupFunction,
        process: mockProcess,
      });

      listener.attach();
      (listener as unknown as { isSignalReceived: boolean }).isSignalReceived =
        true;

      const handler = mockProcess.on.mock.calls[0][1];
      handler('SIGINT');

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(cleanupFunction).not.toHaveBeenCalled();
      expect(mockProcess.kill).not.toHaveBeenCalled();
    });

    it('should handle async cleanup function', async () => {
      const asyncCleanup = jest.fn().mockResolvedValue(undefined);
      const listener = new ShutdownListener({
        cleanupFunction: asyncCleanup,
        process: mockProcess,
      });

      listener.attach();

      const handler = mockProcess.on.mock.calls[0][1];
      handler('SIGINT');

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(asyncCleanup).toHaveBeenCalled();
      expect(mockProcess.removeListener).toHaveBeenCalled();
      expect(mockProcess.kill).toHaveBeenCalledWith(12345, 'SIGINT');
    });
  });

  describe('removeListener', () => {
    it('should remove all signal listeners', () => {
      const listener = new ShutdownListener({
        cleanupFunction,
        process: mockProcess,
      });

      // Access the protected method
      (listener as unknown as { removeListener: () => void }).removeListener();

      expect(mockProcess.removeListener).toHaveBeenCalledWith(
        'SIGINT',
        expect.any(Function),
      );
      expect(mockProcess.removeListener).toHaveBeenCalledWith(
        'SIGTERM',
        expect.any(Function),
      );
    });
  });
});
