import { TerminalTty } from './terminals/terminal-tty';
import { BarItem } from './bar-item';
import { Progress } from './progress';
export declare class Bar {
    protected terminal: TerminalTty;
    protected items: BarItem[];
    protected isStarted: boolean;
    protected nextUpdate: null | Promise<never>;
    constructor(terminal?: TerminalTty);
    add(bar: BarItem): this;
    removeByProgress(progress: Progress): void;
    render(): void;
    logWrap(logFunction: () => void): void;
    start(): void;
    protected addListenerToProgress(item: BarItem): void;
    protected refresh: () => void;
}
