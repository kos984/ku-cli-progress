/// <reference types="node" />
import { Progress } from './progress';
import { TerminalTty } from '../terminals/terminal-tty';
import { EventEmitter } from 'events';
import { ITerminal } from '../terminals/types';
import { IRender } from './types';
export interface IBarOptions {
    terminal?: ITerminal;
    render?: IRender;
}
export declare class Bar extends EventEmitter {
    protected progresses: Array<Progress | Progress[]>;
    protected render: IRender;
    protected terminal: TerminalTty;
    constructor(progresses?: Array<Progress | Progress[]>, render?: IRender);
    start(): Promise<void>;
    add(progress: Progress | Progress[]): void;
    remove(progress: Progress | Progress[]): void;
    renderBars(): void;
    protected isComplete(processes: Array<Progress | Progress[]>): boolean;
}
