import { loopProgresses, start } from '../loop-progresses';
import { IProgress } from '../../../lib/interfaces/progress.interface';

// Mock console.error to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('loop-progresses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('loopProgresses', () => {
    it('should loop progresses with default delay', () => {
      const mockProgress1 = {
        increment: jest.fn(),
        getProgress: jest.fn().mockReturnValue(0),
      } as unknown as IProgress;

      const mockProgress2 = {
        increment: jest.fn(),
        getProgress: jest.fn().mockReturnValue(0),
      } as unknown as IProgress;

      const progresses = [mockProgress1, mockProgress2];
      const intervals = loopProgresses(progresses);

      expect(intervals).toHaveLength(2);
      expect(intervals[0]).toBeDefined();
      expect(intervals[1]).toBeDefined();

      // Fast-forward time to trigger intervals
      jest.advanceTimersByTime(100);

      expect(mockProgress1.increment).toHaveBeenCalled();
      expect(mockProgress2.increment).toHaveBeenCalled();
    });

    it('should loop progresses with custom delay function', () => {
      const mockProgress = {
        increment: jest.fn(),
        getProgress: jest.fn().mockReturnValue(0),
      } as unknown as IProgress;

      const customDelay = jest.fn().mockReturnValue(200);
      const progresses = [mockProgress];
      const intervals = loopProgresses(progresses, { getDelay: customDelay });

      expect(intervals).toHaveLength(1);
      expect(customDelay).toHaveBeenCalled();

      // Fast-forward time to trigger interval
      jest.advanceTimersByTime(200);

      expect(mockProgress.increment).toHaveBeenCalled();
    });

    it('should stop interval when progress reaches 1', () => {
      const mockProgress = {
        increment: jest.fn(),
        getProgress: jest.fn().mockReturnValue(1), // Always return 1 (complete)
      } as unknown as IProgress;

      const progresses = [mockProgress];
      const intervals = loopProgresses(progresses);

      expect(intervals).toHaveLength(1);

      // Fast-forward time to trigger interval
      jest.advanceTimersByTime(100);

      // Should increment once, then check and stop
      expect(mockProgress.increment).toHaveBeenCalledTimes(1);
    });

    it('should handle empty progresses array', () => {
      const intervals = loopProgresses([]);
      expect(intervals).toHaveLength(0);
    });
  });

  describe('start', () => {
    it('should execute function and catch errors', () => {
      const mockFunction = jest.fn().mockRejectedValue(new Error('Test error'));

      start(mockFunction);

      // The function should be called immediately
      expect(mockFunction).toHaveBeenCalled();
    });

    it('should execute function successfully', () => {
      const mockFunction = jest.fn().mockResolvedValue(undefined);

      start(mockFunction);

      // The function should be called immediately
      expect(mockFunction).toHaveBeenCalled();
    });
  });
});
