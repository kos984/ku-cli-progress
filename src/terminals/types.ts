import { Writable } from 'stream';

export interface ITerminal {
  write(s: string): void
}
