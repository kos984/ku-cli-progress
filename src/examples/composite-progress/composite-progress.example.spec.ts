jest.mock('../../lib/terminals/terminal-tty');
jest.mock('../helpers/loop-progresses');
jest.mock('../../lib/formatters/bars-formatter');
jest.mock('../../lib/time/time');
jest.mock('chalk', () => {
  return {
    green: (str: string) => `<green>${str}</green>`,
    yellowBright: (str: string) => `<yellowBright>${str}</yellowBright>`,
  };
});

import { TerminalTty } from '../../lib/terminals/terminal-tty';
import { bar } from './composite-progress.example';
import { ExampleBarTestHelper } from '../__tests__/example-bar-test-helper';

describe('CompositeProgressComponent', () => {
  const MAX_STEPS = 10;
  const terminalMock = new TerminalTty() as jest.Mocked<TerminalTty>;

  const exampleBarTestHelper = new ExampleBarTestHelper({
    bar,
    maxSteps: MAX_STEPS,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    exampleBarTestHelper.beforeEach();
  });

  it('one by one', () => {
    exampleBarTestHelper.iterate(progress => progress.getTotal() / MAX_STEPS);
    const calls = terminalMock.write.mock.calls.map(call => call[0]);
    expect(calls).toMatchObject([
      '[00001111░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] <green>read: 200/1000 ( 20% eta: ∞)</green> <yellowBright>write: 100/1000 ( 10% eta: ∞)</yellowBright>\n',
      '[000000001111░░░░░░░░░░░░░░░░░░░░░░░░░░░░] <green>read: 300/1000 ( 30% eta: 4s)</green> <yellowBright>write: 200/1000 ( 20% eta: 4s)</yellowBright>\n',
      '[0000000000001111░░░░░░░░░░░░░░░░░░░░░░░░] <green>read: 400/1000 ( 40% eta: 4s)</green> <yellowBright>write: 300/1000 ( 30% eta: 5s)</yellowBright>\n',
      '[00000000000000001111░░░░░░░░░░░░░░░░░░░░] <green>read: 500/1000 ( 50% eta: 4s)</green> <yellowBright>write: 400/1000 ( 40% eta: 5s)</yellowBright>\n',
      '[000000000000000000001111░░░░░░░░░░░░░░░░] <green>read: 600/1000 ( 60% eta: 3s)</green> <yellowBright>write: 500/1000 ( 50% eta: 4s)</yellowBright>\n',
      '[0000000000000000000000001111░░░░░░░░░░░░] <green>read: 700/1000 ( 70% eta: 3s)</green> <yellowBright>write: 600/1000 ( 60% eta: 4s)</yellowBright>\n',
      '[00000000000000000000000000001111░░░░░░░░] <green>read: 800/1000 ( 80% eta: 2s)</green> <yellowBright>write: 700/1000 ( 70% eta: 3s)</yellowBright>\n',
      '[000000000000000000000000000000001111░░░░] <green>read: 900/1000 ( 90% eta: 1s)</green> <yellowBright>write: 800/1000 ( 80% eta: 2s)</yellowBright>\n',
      '[0000000000000000000000000000000000001111] <green>read: 1000/1000 ( 100% eta: 0s)</green> <yellowBright>write: 900/1000 ( 90% eta: 1s)</yellowBright>\n',
      '[0000000000000000000000000000000000000000] <green>read: 1000/1000 ( 100% eta: 0s)</green> <yellowBright>write: 1000/1000 ( 100% eta: 0s)</yellowBright>\n',
    ]);
  });

  it('one by few', () => {
    exampleBarTestHelper.iterate(
      (progress, index) => (progress.getTotal() * (index + 1)) / MAX_STEPS,
    );
    const calls = terminalMock.write.mock.calls.map(call => call[0]);
    expect(calls).toMatchObject([
      '[00000000░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] <green>read: 200/1000 ( 20% eta: ∞)</green> <yellowBright>write: 200/1000 ( 20% eta: ∞)</yellowBright>\n',
      '[0000000000001111░░░░░░░░░░░░░░░░░░░░░░░░] <green>read: 300/1000 ( 30% eta: 4s)</green> <yellowBright>write: 400/1000 ( 40% eta: 2s)</yellowBright>\n',
      '[000000000000000011111111░░░░░░░░░░░░░░░░] <green>read: 400/1000 ( 40% eta: 4s)</green> <yellowBright>write: 600/1000 ( 60% eta: 1s)</yellowBright>\n',
      '[00000000000000000000111111111111░░░░░░░░] <green>read: 500/1000 ( 50% eta: 4s)</green> <yellowBright>write: 800/1000 ( 80% eta: 1s)</yellowBright>\n',
      '[0000000000000000000000001111111111111111] <green>read: 600/1000 ( 60% eta: 3s)</green> <yellowBright>write: 1000/1000 ( 100% eta: 0s)</yellowBright>\n',
      '[0000000000000000000000000000111111111111] <green>read: 700/1000 ( 70% eta: 3s)</green> <yellowBright>write: 1000/1000 ( 100% eta: 0s)</yellowBright>\n',
      '[0000000000000000000000000000000011111111] <green>read: 800/1000 ( 80% eta: 2s)</green> <yellowBright>write: 1000/1000 ( 100% eta: 0s)</yellowBright>\n',
      '[0000000000000000000000000000000000001111] <green>read: 900/1000 ( 90% eta: 1s)</green> <yellowBright>write: 1000/1000 ( 100% eta: 0s)</yellowBright>\n',
      '[0000000000000000000000000000000000000000] <green>read: 1000/1000 ( 100% eta: 0s)</green> <yellowBright>write: 1000/1000 ( 100% eta: 0s)</yellowBright>\n',
    ]);
  });

  it('one by few2', () => {
    exampleBarTestHelper.iterate(
      (progress, index) =>
        (progress.getTotal() *
          (exampleBarTestHelper.progresses.length - index)) /
        MAX_STEPS,
    );
    const calls = terminalMock.write.mock.calls.map(call => call[0]);
    expect(calls).toMatchObject([
      '[000011111111░░░░░░░░░░░░░░░░░░░░░░░░░░░░] <green>read: 300/1000 ( 30% eta: ∞)</green> <yellowBright>write: 100/1000 ( 10% eta: ∞)</yellowBright>\n',
      '[00000000111111111111░░░░░░░░░░░░░░░░░░░░] <green>read: 500/1000 ( 50% eta: 1s)</green> <yellowBright>write: 200/1000 ( 20% eta: 4s)</yellowBright>\n',
      '[0000000000001111111111111111░░░░░░░░░░░░] <green>read: 700/1000 ( 70% eta: 1s)</green> <yellowBright>write: 300/1000 ( 30% eta: 5s)</yellowBright>\n',
      '[000000000000000011111111111111111111░░░░] <green>read: 900/1000 ( 90% eta: 0s)</green> <yellowBright>write: 400/1000 ( 40% eta: 5s)</yellowBright>\n',
      '[0000000000000000000011111111111111111111] <green>read: 1000/1000 ( 100% eta: 0s)</green> <yellowBright>write: 500/1000 ( 50% eta: 4s)</yellowBright>\n',
      '[0000000000000000000000001111111111111111] <green>read: 1000/1000 ( 100% eta: 0s)</green> <yellowBright>write: 600/1000 ( 60% eta: 4s)</yellowBright>\n',
      '[0000000000000000000000000000111111111111] <green>read: 1000/1000 ( 100% eta: 0s)</green> <yellowBright>write: 700/1000 ( 70% eta: 3s)</yellowBright>\n',
      '[0000000000000000000000000000000011111111] <green>read: 1000/1000 ( 100% eta: 0s)</green> <yellowBright>write: 800/1000 ( 80% eta: 2s)</yellowBright>\n',
      '[0000000000000000000000000000000000001111] <green>read: 1000/1000 ( 100% eta: 0s)</green> <yellowBright>write: 900/1000 ( 90% eta: 1s)</yellowBright>\n',
      '[0000000000000000000000000000000000000000] <green>read: 1000/1000 ( 100% eta: 0s)</green> <yellowBright>write: 1000/1000 ( 100% eta: 0s)</yellowBright>\n',
    ]);
  });
});
