import { TerminalTty } from './terminals/terminal-tty';
import { Bar } from './bar';
import { Progress } from './progress';
export declare class BarsContainer {
    protected terminal: TerminalTty;
    protected items: Bar[];
    protected isStarted: boolean;
    protected nextUpdate: null | Promise<never>;
    constructor(terminal?: TerminalTty);
    add(bar: Bar): this;
    removeByProgress(progress: Progress): void;
    render(): void;
    log(str: string): void;
    testLog(f: () => void): void;
    start(): void;
    protected addListenerToProgress(item: Bar): void;
    protected refresh: () => void;
}
