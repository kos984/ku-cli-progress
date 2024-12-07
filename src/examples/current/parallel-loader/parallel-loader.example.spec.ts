import { bar } from '../../multi-files-processing/multi-files-processing.example';

jest.mock('../../../lib/terminals/terminal-tty');
jest.mock('../../helpers/loop-progresses');
jest.mock('../../helpers/logger');
jest.mock('../../helpers/interval');
jest.mock('../../../lib/formatters/bars-formatter');
jest.mock('../../../lib/time/time');

import { TerminalTty } from '../../../lib/terminals/terminal-tty';
import { Logger } from '../../helpers/logger';
import { run, logger } from './parallel-loader.example';

describe('parallel-loader.example', () => {
  const terminalMock = new TerminalTty() as jest.Mocked<TerminalTty>;
  const loggerMock = logger as jest.Mocked<Logger>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('one by one', async () => {
    let counter = 0;
    jest
      .spyOn(bar as never as { reRender: () => void }, 'reRender')
      .mockImplementation(() => {
        if (counter++ > 3000) {
          counter = 0;
          bar.render();
        }
      });
    await run();
    bar.render(); // unsure we render the last time
    throw new Error('not implemented');
    const calls = terminalMock.write.mock.calls.map(call => call[0]);
    expect(calls).not.toMatchObject([
      '[00001░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 1300 (1000) total: 10000 13% (10%) ETA: ∞ (∞)\n',
      '[000000001░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 2300 (2000) total: 10000 23% (20%) ETA: 4s (4s)\n',
      '[0000000000001░░░░░░░░░░░░░░░░░░░░░░░░░░░] 3300 (3000) total: 10000 33% (30%) ETA: 5s (5s)\n',
      '[00000000000000001░░░░░░░░░░░░░░░░░░░░░░░] 4300 (4000) total: 10000 43% (40%) ETA: 4s (5s)\n',
      '[000000000000000000001░░░░░░░░░░░░░░░░░░░] 5300 (5000) total: 10000 53% (50%) ETA: 4s (4s)\n',
      '[0000000000000000000000001░░░░░░░░░░░░░░░] 6300 (6000) total: 10000 63% (60%) ETA: 3s (4s)\n',
      '[00000000000000000000000000001░░░░░░░░░░░] 7300 (7000) total: 10000 73% (70%) ETA: 3s (3s)\n',
      '[000000000000000000000000000000001░░░░░░░] 8300 (8000) total: 10000 83% (80%) ETA: 2s (2s)\n',
      '[0000000000000000000000000000000000001░░░] 9300 (9000) total: 10000 93% (90%) ETA: 1s (1s)\n',
      '[0000000000000000000000000000000000000000] 10000 (10000) total: 10000 100% (100%) ETA: 0s (0s)\n',
    ]);
  });
});
