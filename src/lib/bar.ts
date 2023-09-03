import { TerminalTty } from './terminals/terminal-tty';
import { ITerminal } from './interfaces/terminal.interface';
import { IBarItem } from './interfaces/bar-item.interface';
import { IProgress } from './interfaces/progress.interface';
import EventEmitter from 'events';

export interface IOptions {
  refreshTimeMs: number;
}

export class Bar {
  protected items: IBarItem[] = [];
  protected isStarted = false;
  protected nextUpdate: null | Promise<never> = null;
  protected timeOutId: NodeJS.Timeout | undefined;

  public constructor(
    protected terminal: ITerminal = new TerminalTty(),
    protected options?: IOptions
    ) {
    this.options = {
      refreshTimeMs: 50,
      ...options
    };
  }

  public add(bar: IBarItem) {
    this.items.push(bar)
    if (this.isStarted) {
      this.addListenerToProgress(bar)
    }
    return this;
  }

  public removeByProgress(progress: IProgress) {
    this.items = this.items.filter(
      item => !item.getProgresses().find(p => p == progress)
    )
    this.refresh();
  }

  public render() {
    const lines = this.items.map( bar => {
      return bar.render();
    })
    this.terminal.write(lines.join('\n') + '\n');
  }

  public logWrap(logFunction: () => void) {
    this.terminal.clear();
    logFunction();
    this.terminal.refresh();
  }

  public start() {
    this.isStarted = true;
    this.items.forEach(item => this.addListenerToProgress(item))
    this.render();
  }

  public stop() {
    this.items.forEach(item => this.removeListenersFromProgresses(item));
    clearTimeout(this.timeOutId);
    this.nextUpdate = null;
    this.isStarted = false;
  }

  protected addListenerToProgress(item: IBarItem) {
    item.getProgresses().forEach(progress => {
      progress.on('update', this.refresh);
    });
  }

  protected removeListenersFromProgresses(item: IBarItem) {
    item.getProgresses().forEach(progress => {
      (progress.emitter as EventEmitter).removeListener('update', this.refresh);
    });
  }

  protected refresh = () => {
    if (!this.isStarted || this.nextUpdate) {
      return;
    }
    this.nextUpdate = new Promise(resolve => {
      this.timeOutId = setTimeout(() => {
        this.nextUpdate = null;
        this.render();
      }, this.options.refreshTimeMs);
    })
  }
}
