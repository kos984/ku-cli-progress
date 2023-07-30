/// <reference types="node" />
import { ITerminal } from './types';
import { WriteStream } from 'tty';
export declare class TerminalTty implements ITerminal {
    protected y: number;
    protected prev: string;
    protected stream: WriteStream;
    constructor();
    cursor(enabled: boolean): void;
    resetCursor(lines: number): void;
    write(s: string): void;
    clear(): void;
    refresh(): void;
}
