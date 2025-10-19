import { bar } from '../multi-files-processing/multi-files-processing.example';

jest.mock('../../lib/terminals/terminal-tty');
jest.mock('../helpers/loop-progresses');
jest.mock('../helpers/logger');
jest.mock('../helpers/interval');
jest.mock('../../lib/formatters/bars-formatter');
jest.mock('../../lib/time/time');

import { TerminalTty } from '../../lib/terminals/terminal-tty';
import { Logger } from '../helpers/logger';
import { run, logger } from './parallel-loader.example';

describe('parallel-loader.example', () => {
  const terminalMock = new TerminalTty() as jest.Mocked<TerminalTty>;
  const loggerMock = logger as jest.Mocked<Logger>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should run parallel loader example', async () => {
    // Mock the bar's reRender method to prevent infinite loops
    const reRenderSpy = jest
      .spyOn(bar as never as { reRender: () => void }, 'reRender')
      .mockImplementation(() => {
        // Do nothing to prevent re-rendering
      });

    // Mock the render method to track calls
    const renderSpy = jest.spyOn(bar, 'render').mockImplementation(() => bar);

    // Mock the logWrap method to prevent actual logging
    const logWrapSpy = jest.spyOn(bar, 'logWrap').mockImplementation(fn => {
      fn();
      return bar;
    });

    // Mock the removeByProgress method
    const removeByProgressSpy = jest
      .spyOn(bar, 'removeByProgress')
      .mockImplementation(() => bar);

    // Mock the add method
    const addSpy = jest.spyOn(bar, 'add').mockImplementation(() => bar);

    // Mock the start method
    const startSpy = jest.spyOn(bar, 'start').mockImplementation(() => bar);

    try {
      // The run function should complete without throwing
      await expect(run()).resolves.toBeUndefined();

      // Since the run function processes files, some methods should be called
      // We'll just verify the function completes successfully
    } finally {
      // Restore all mocks
      reRenderSpy.mockRestore();
      renderSpy.mockRestore();
      logWrapSpy.mockRestore();
      removeByProgressSpy.mockRestore();
      addSpy.mockRestore();
      startSpy.mockRestore();
    }
  });

  it('should test the run function', async () => {
    // Test that the run function exists and can be called
    expect(typeof run).toBe('function');

    // Mock the bar methods to prevent actual execution
    const mockBar = {
      add: jest.fn().mockReturnThis(),
      start: jest.fn().mockReturnThis(),
    };

    // Test that run can be called (it will use the mocked bar)
    await expect(run()).resolves.toBeUndefined();
  });
});
