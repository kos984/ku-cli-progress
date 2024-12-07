import * as fs from 'node:fs';

jest.mock('../../lib/terminals/terminal-tty');
jest.mock('../helpers/loop-progresses');
jest.mock('../../lib/formatters/bars-formatter');
jest.mock('../../lib/time/time');

import { TerminalTty } from '../../lib/terminals/terminal-tty';
import { bar, run } from './multi-files-processing.example';
import { Readable } from 'node:stream';
import { ReadStream } from 'fs';
import { ExampleBarTestHelper } from '../__tests__/example-bar-test-helper';

describe('eta-human-readable.example', () => {
  const terminalMock = new TerminalTty() as jest.Mocked<TerminalTty>;

  const exampleBarTestHelper = new ExampleBarTestHelper({
    bar,
    maxSteps: 0,
    stopBarOnStart: false,
  });

  exampleBarTestHelper.setMockReturnValue(0);
  beforeEach(() => {
    jest.clearAllMocks();
    // exampleBarTestHelper.beforeEach();
  });

  it('eta-human-readable.example run', async () => {
    let counter = 0;
    let step = 1;
    jest
      .spyOn(bar as never as { reRender: () => void }, 'reRender')
      .mockImplementation(() => {
        if (counter++ > 100) {
          counter = 0;
          exampleBarTestHelper.setMockReturnValue(step * 1000);
          // (getTime as jest.Mock).mockReturnValue(step * 1000);
          step++;
          bar.render();
        }
      });
    jest.spyOn(fs, 'createReadStream').mockImplementation(() => {
      return new Readable({
        read() {
          const chunkSize = Math.min(1024000); // 2 9721 5488
          if (chunkSize > 0) {
            const chunk = Buffer.alloc(chunkSize);
            this.push(chunk);
            // dataSize -= chunkSize;
          } else {
            this.push(null); // End of stream
          }
        },
      }) as never as ReadStream;
    });
    await run();
    bar.render();
    const calls = terminalMock.write.mock.calls.map(call =>
      call[0].split('\n').filter(Boolean),
    );
    expect(calls).toMatchObject([
      [
        '[                                        ] 0% ETA: ∞ speed: 0/s duration: 1s 0/30 [0 Bytes/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 13s 6.84 MB/5.2 MB [file_0.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 37s 18.55 MB/17.43 MB [file_1.log]',
        '[00000000000000000                       ] 42 ETA: 212 speed: 512000/s duration: 1s 74.22 MB/177.91 MB [file_2.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 1s 0 Bytes/44.96 MB [file_3.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 1s 0 Bytes/210 MB [file_4.log]',
      ],
      [
        '[                                        ] 0% ETA: ∞ speed: 0/s duration: 2s 0/30 [0 Bytes/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 13s 6.84 MB/5.2 MB [file_0.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 37s 18.55 MB/17.43 MB [file_1.log]',
        '[000000000000000000000000000000000000000 ] 98 ETA: 8 speed: 512000/s duration: 2s 173.83 MB/177.91 MB [file_2.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 2s 0 Bytes/44.96 MB [file_3.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 2s 0 Bytes/210 MB [file_4.log]',
      ],
      [
        '[                                        ] 0% ETA: ∞ speed: 0/s duration: 3s 0/30 [0 Bytes/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 13s 6.84 MB/5.2 MB [file_0.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 37s 18.55 MB/17.43 MB [file_1.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 2s 179.69 MB/177.91 MB [file_2.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 2s 46.88 MB/44.96 MB [file_3.log]',
        '[000000000                               ] 22 ETA: 334 speed: 512000/s duration: 3s 46.88 MB/210 MB [file_4.log]',
      ],
      [
        '[                                        ] 0% ETA: ∞ speed: 0/s duration: 4s 0/30 [0 Bytes/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 13s 6.84 MB/5.2 MB [file_0.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 37s 18.55 MB/17.43 MB [file_1.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 2s 179.69 MB/177.91 MB [file_2.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 2s 46.88 MB/44.96 MB [file_3.log]',
        '[0000000000000000000000000000            ] 70 ETA: 2 speed: 27042909/s duration: 4s 146.48 MB/210 MB [file_4.log]',
      ],
      [
        '[0000000                                 ] 17% ETA: 1m40s speed: 0/s duration: 5s 5/30 [455.49 MB/3.61 GB]',
        '[0000                                    ] 11 ETA: 416 speed: 512000/s duration: 5s 24.41 MB/227.44 MB [file_5.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 5s 0 Bytes/50.59 MB [file_6.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 5s 0 Bytes/255.43 MB [file_7.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 5s 0 Bytes/258.56 MB [file_8.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 5s 0 Bytes/14.39 MB [file_9.log]',
      ],
      [
        '[0000000                                 ] 17% ETA: 1m40s speed: 0/s duration: 6s 5/30 [455.49 MB/3.61 GB]',
        '[0000000000000000000000                  ] 55 ETA: 212 speed: 512000/s duration: 6s 124.02 MB/227.44 MB [file_5.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 6s 0 Bytes/50.59 MB [file_6.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 6s 0 Bytes/255.43 MB [file_7.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 6s 0 Bytes/258.56 MB [file_8.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 6s 0 Bytes/14.39 MB [file_9.log]',
      ],
      [
        '[0000000                                 ] 17% ETA: 1m40s speed: 0/s duration: 7s 5/30 [455.49 MB/3.61 GB]',
        '[000000000000000000000000000000000000000 ] 98 ETA: 8 speed: 512000/s duration: 7s 223.63 MB/227.44 MB [file_5.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 7s 0 Bytes/50.59 MB [file_6.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 7s 0 Bytes/255.43 MB [file_7.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 7s 0 Bytes/258.56 MB [file_8.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 7s 0 Bytes/14.39 MB [file_9.log]',
      ],
      [
        '[0000000                                 ] 17% ETA: 1m40s speed: 0/s duration: 8s 5/30 [455.49 MB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 228.52 MB/227.44 MB [file_5.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 51.76 MB/50.59 MB [file_6.log]',
        '[0000000                                 ] 17 ETA: 1523 speed: 146286/s duration: 8s 42.97 MB/255.43 MB [file_7.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 8s 0 Bytes/258.56 MB [file_8.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 8s 0 Bytes/14.39 MB [file_9.log]',
      ],
      [
        '[0000000                                 ] 17% ETA: 1m40s speed: 0/s duration: 9s 5/30 [455.49 MB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 228.52 MB/227.44 MB [file_5.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 51.76 MB/50.59 MB [file_6.log]',
        '[0000000000000000000000                  ] 56 ETA: 5 speed: 24642494/s duration: 9s 142.58 MB/255.43 MB [file_7.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 9s 0 Bytes/258.56 MB [file_8.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 9s 0 Bytes/14.39 MB [file_9.log]',
      ],
      [
        '[0000000                                 ] 17% ETA: 1m40s speed: 0/s duration: 10s 5/30 [455.49 MB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 228.52 MB/227.44 MB [file_5.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 51.76 MB/50.59 MB [file_6.log]',
        '[00000000000000000000000000000000000000  ] 95 ETA: 0 speed: 55677968/s duration: 10s 242.19 MB/255.43 MB [file_7.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 10s 0 Bytes/258.56 MB [file_8.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 10s 0 Bytes/14.39 MB [file_9.log]',
      ],
      [
        '[0000000                                 ] 17% ETA: 1m40s speed: 0/s duration: 11s 5/30 [455.49 MB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 228.52 MB/227.44 MB [file_5.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 51.76 MB/50.59 MB [file_6.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 10s 256.84 MB/255.43 MB [file_7.log]',
        '[0000000000000                           ] 33 ETA: 1778 speed: 102400/s duration: 11s 84.96 MB/258.56 MB [file_8.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 11s 0 Bytes/14.39 MB [file_9.log]',
      ],
      [
        '[0000000                                 ] 17% ETA: 1m40s speed: 0/s duration: 12s 5/30 [455.49 MB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 228.52 MB/227.44 MB [file_5.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 7s 51.76 MB/50.59 MB [file_6.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 10s 256.84 MB/255.43 MB [file_7.log]',
        '[00000000000000000000000000000           ] 71 ETA: 2 speed: 48640000/s duration: 12s 184.57 MB/258.56 MB [file_8.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 12s 0 Bytes/14.39 MB [file_9.log]',
      ],
      [
        '[000000000000                            ] 30% ETA: 46s speed: 0/s duration: 13s 9/30 [1.22 GB/3.61 GB]',
      ],
      [
        '[0000000000000                           ] 33% ETA: 11s speed: 2/s duration: 14s 10/30 [1.23 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 95s 46.88 MB/45.88 MB [file_10.log]',
        '[000000000000000                         ] 39 ETA: 169 speed: 512000/s duration: 14s 51.76 MB/134.11 MB [file_11.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 14s 0 Bytes/34.25 MB [file_12.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 14s 0 Bytes/274.34 MB [file_13.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 14s 0 Bytes/58.72 MB [file_14.log]',
      ],
      [
        '[0000000000000                           ] 33% ETA: 11s speed: 2/s duration: 15s 10/30 [1.23 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 95s 46.88 MB/45.88 MB [file_10.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 14s 135.74 MB/134.11 MB [file_11.log]',
        '[000000000000000000                      ] 46 ETA: 267 speed: 73143/s duration: 15s 15.63 MB/34.25 MB [file_12.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 15s 0 Bytes/274.34 MB [file_13.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 15s 0 Bytes/58.72 MB [file_14.log]',
      ],
      [
        '[0000000000000                           ] 33% ETA: 11s speed: 2/s duration: 16s 10/30 [1.23 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 95s 46.88 MB/45.88 MB [file_10.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 14s 135.74 MB/134.11 MB [file_11.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 15s 36.13 MB/34.25 MB [file_12.log]',
        '[000000000000                            ] 29 ETA: 2999 speed: 68267/s duration: 16s 79.1 MB/274.34 MB [file_13.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 16s 0 Bytes/58.72 MB [file_14.log]',
      ],
      [
        '[0000000000000                           ] 33% ETA: 11s speed: 2/s duration: 17s 10/30 [1.23 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 95s 46.88 MB/45.88 MB [file_10.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 14s 135.74 MB/134.11 MB [file_11.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 15s 36.13 MB/34.25 MB [file_12.log]',
        '[00000000000000000000000000              ] 65 ETA: 2 speed: 45273212/s duration: 17s 178.71 MB/274.34 MB [file_13.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 17s 0 Bytes/58.72 MB [file_14.log]',
      ],
      [
        '[0000000000000                           ] 33% ETA: 11s speed: 2/s duration: 18s 10/30 [1.23 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 95s 46.88 MB/45.88 MB [file_10.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 14s 135.74 MB/134.11 MB [file_11.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 15s 36.13 MB/34.25 MB [file_12.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 17s 275.39 MB/274.34 MB [file_13.log]',
        '[00                                      ] 5 ETA: 971 speed: 60235/s duration: 18s 2.93 MB/58.72 MB [file_14.log]',
      ],
      [
        '[00000000000000000000                    ] 50% ETA: 11s speed: 1/s duration: 19s 15/30 [1.77 GB/3.61 GB]',
        '[00000000                                ] 20 ETA: 258 speed: 512000/s duration: 19s 32.23 MB/158.12 MB [file_15.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 19s 0 Bytes/235.79 MB [file_16.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 19s 0 Bytes/8.26 MB [file_17.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 19s 0 Bytes/271.95 MB [file_18.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 19s 0 Bytes/154.34 MB [file_19.log]',
      ],
      [
        '[00000000000000000000                    ] 50% ETA: 11s speed: 1/s duration: 20s 15/30 [1.77 GB/3.61 GB]',
        '[000000000000000000000000000000000       ] 83 ETA: 54 speed: 512000/s duration: 20s 131.84 MB/158.12 MB [file_15.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 20s 0 Bytes/235.79 MB [file_16.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 20s 0 Bytes/8.26 MB [file_17.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 20s 0 Bytes/271.95 MB [file_18.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 20s 0 Bytes/154.34 MB [file_19.log]',
      ],
      [
        '[00000000000000000000                    ] 50% ETA: 11s speed: 1/s duration: 21s 15/30 [1.77 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 20s 159.18 MB/158.12 MB [file_15.log]',
        '[000000000000                            ] 31 ETA: 3349 speed: 51200/s duration: 21s 72.27 MB/235.79 MB [file_16.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 21s 0 Bytes/8.26 MB [file_17.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 21s 0 Bytes/271.95 MB [file_18.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 21s 0 Bytes/154.34 MB [file_19.log]',
      ],
      [
        '[00000000000000000000                    ] 50% ETA: 11s speed: 1/s duration: 22s 15/30 [1.77 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 20s 159.18 MB/158.12 MB [file_15.log]',
        '[00000000000000000000000000000           ] 73 ETA: 2 speed: 41355636/s duration: 22s 171.88 MB/235.79 MB [file_16.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 22s 0 Bytes/8.26 MB [file_17.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 22s 0 Bytes/271.95 MB [file_18.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 22s 0 Bytes/154.34 MB [file_19.log]',
      ],
      [
        '[00000000000000000000                    ] 50% ETA: 11s speed: 1/s duration: 23s 15/30 [1.77 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 20s 159.18 MB/158.12 MB [file_15.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 237.3 MB/235.79 MB [file_16.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 9.77 MB/8.26 MB [file_17.log]',
        '[0000                                    ] 9 ETA: 5577 speed: 46545/s duration: 23s 24.41 MB/271.95 MB [file_18.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 23s 0 Bytes/154.34 MB [file_19.log]',
      ],
      [
        '[00000000000000000000                    ] 50% ETA: 11s speed: 1/s duration: 24s 15/30 [1.77 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 20s 159.18 MB/158.12 MB [file_15.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 237.3 MB/235.79 MB [file_16.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 9.77 MB/8.26 MB [file_17.log]',
        '[000000000000000000                      ] 46 ETA: 11 speed: 13984793/s duration: 24s 124.02 MB/271.95 MB [file_18.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 24s 0 Bytes/154.34 MB [file_19.log]',
      ],
      [
        '[00000000000000000000                    ] 50% ETA: 11s speed: 1/s duration: 25s 15/30 [1.77 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 20s 159.18 MB/158.12 MB [file_15.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 237.3 MB/235.79 MB [file_16.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 9.77 MB/8.26 MB [file_17.log]',
        '[000000000000000000000000000000000       ] 82 ETA: 1 speed: 49164929/s duration: 25s 223.63 MB/271.95 MB [file_18.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 25s 0 Bytes/154.34 MB [file_19.log]',
      ],
      [
        '[00000000000000000000                    ] 50% ETA: 11s speed: 1/s duration: 26s 15/30 [1.77 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 20s 159.18 MB/158.12 MB [file_15.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 237.3 MB/235.79 MB [file_16.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 9.77 MB/8.26 MB [file_17.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 25s 273.44 MB/271.95 MB [file_18.log]',
        '[0000000000000                           ] 32 ETA: 2676 speed: 40960/s duration: 26s 49.8 MB/154.34 MB [file_19.log]',
      ],
      [
        '[00000000000000000000                    ] 50% ETA: 11s speed: 1/s duration: 27s 15/30 [1.77 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 20s 159.18 MB/158.12 MB [file_15.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 237.3 MB/235.79 MB [file_16.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 22s 9.77 MB/8.26 MB [file_17.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 25s 273.44 MB/271.95 MB [file_18.log]',
        '[000000000000000000000000000000000000000 ] 97 ETA: 0 speed: 28504436/s duration: 27s 149.41 MB/154.34 MB [file_19.log]',
      ],
      [
        '[000000000000000000000000000             ] 67% ETA: 9s speed: 1/s duration: 28s 20/30 [2.58 GB/3.61 GB]',
        '[0000000000000000                        ] 39 ETA: 267 speed: 512000/s duration: 28s 83.01 MB/213.2 MB [file_20.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 28s 0 Bytes/119.53 MB [file_21.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 28s 0 Bytes/108.64 MB [file_22.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 28s 0 Bytes/23.32 MB [file_23.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 28s 0 Bytes/204.89 MB [file_24.log]',
      ],
      [
        '[000000000000000000000000000             ] 67% ETA: 9s speed: 1/s duration: 29s 20/30 [2.58 GB/3.61 GB]',
        '[0000000000000000000000000000000000      ] 86 ETA: 63 speed: 512000/s duration: 29s 182.62 MB/213.2 MB [file_20.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 29s 0 Bytes/119.53 MB [file_21.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 29s 0 Bytes/108.64 MB [file_22.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 29s 0 Bytes/23.32 MB [file_23.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 29s 0 Bytes/204.89 MB [file_24.log]',
      ],
      [
        '[000000000000000000000000000             ] 67% ETA: 9s speed: 1/s duration: 30s 20/30 [2.58 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 29s 214.84 MB/213.2 MB [file_20.log]',
        '[00000000000000000000000                 ] 56 ETA: 1548 speed: 35310/s duration: 30s 67.38 MB/119.53 MB [file_21.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 30s 0 Bytes/108.64 MB [file_22.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 30s 0 Bytes/23.32 MB [file_23.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 30s 0 Bytes/204.89 MB [file_24.log]',
      ],
      [
        '[000000000000000000000000000             ] 67% ETA: 9s speed: 1/s duration: 31s 20/30 [2.58 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 29s 214.84 MB/213.2 MB [file_20.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 30s 121.09 MB/119.53 MB [file_21.log]',
        '[00000000000000000                       ] 42 ETA: 1928 speed: 34133/s duration: 31s 45.9 MB/108.64 MB [file_22.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 31s 0 Bytes/23.32 MB [file_23.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 31s 0 Bytes/204.89 MB [file_24.log]',
      ],
      [
        '[000000000000000000000000000             ] 67% ETA: 9s speed: 1/s duration: 32s 20/30 [2.58 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 29s 214.84 MB/213.2 MB [file_20.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 30s 121.09 MB/119.53 MB [file_21.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 31s 110.35 MB/108.64 MB [file_22.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 31s 24.41 MB/23.32 MB [file_23.log]',
        '[00                                      ] 5 ETA: 6163 speed: 33032/s duration: 32s 10.74 MB/204.89 MB [file_24.log]',
      ],
      [
        '[000000000000000000000000000             ] 67% ETA: 9s speed: 1/s duration: 33s 20/30 [2.58 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 29s 214.84 MB/213.2 MB [file_20.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 30s 121.09 MB/119.53 MB [file_21.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 31s 110.35 MB/108.64 MB [file_22.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 31s 24.41 MB/23.32 MB [file_23.log]',
        '[0000000000000000000000                  ] 54 ETA: 16 speed: 6159015/s duration: 33s 110.35 MB/204.89 MB [file_24.log]',
      ],
      [
        '[000000000000000000000000000             ] 67% ETA: 9s speed: 1/s duration: 34s 20/30 [2.58 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 33s 206.05 MB/204.89 MB [file_24.log]',
      ],
      [
        '[000000000000000000000000000000000       ] 83% ETA: 4s speed: 1/s duration: 35s 25/30 [3.23 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 41s 20.51 MB/19.05 MB [file_25.log]',
        '[000000000000000000000000000             ] 68 ETA: 72 speed: 512000/s duration: 35s 73.24 MB/108.21 MB [file_26.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 35s 0 Bytes/135.55 MB [file_27.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 35s 0 Bytes/76.67 MB [file_28.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 35s 0 Bytes/53.39 MB [file_29.log]',
      ],
      [
        '[000000000000000000000000000000000       ] 83% ETA: 4s speed: 1/s duration: 36s 25/30 [3.23 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 41s 20.51 MB/19.05 MB [file_25.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 35s 109.38 MB/108.21 MB [file_26.log]',
        '[0000000000000000000                     ] 47 ETA: 2583 speed: 29257/s duration: 36s 63.48 MB/135.55 MB [file_27.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 36s 0 Bytes/76.67 MB [file_28.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 36s 0 Bytes/53.39 MB [file_29.log]',
      ],
      [
        '[000000000000000000000000000000000       ] 83% ETA: 4s speed: 1/s duration: 37s 25/30 [3.23 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 41s 20.51 MB/19.05 MB [file_25.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 35s 109.38 MB/108.21 MB [file_26.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 36s 136.72 MB/135.55 MB [file_27.log]',
        '[00000000000000                          ] 34 ETA: 1854 speed: 28444/s duration: 37s 26.37 MB/76.67 MB [file_28.log]',
        '[                                        ] 0 ETA: Infinity speed: 0/s duration: 37s 0 Bytes/53.39 MB [file_29.log]',
      ],
      [
        '[000000000000000000000000000000000       ] 83% ETA: 4s speed: 1/s duration: 38s 25/30 [3.23 GB/3.61 GB]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 41s 20.51 MB/19.05 MB [file_25.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 35s 109.38 MB/108.21 MB [file_26.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 36s 136.72 MB/135.55 MB [file_27.log]',
        '[0000000000000000000000000000000000000000] 100 ETA: 0 speed: 0/s duration: 37s 78.13 MB/76.67 MB [file_28.log]',
        '[000000000000000000000000000000000000    ] 90 ETA: 210 speed: 27676/s duration: 38s 47.85 MB/53.39 MB [file_29.log]',
      ],
      [
        '[0000000000000000000000000000000000000000] 100% ETA: 0s speed: 0/s duration: 38s 30/30 [3.61 GB/3.61 GB]',
      ],
    ]);
  });
});
