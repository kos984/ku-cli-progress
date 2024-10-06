import { TerminalTty } from './terminals/terminal-tty';
import { ITerminal } from './interfaces/terminal.interface';
import { IBarItem } from './interfaces/bar-item.interface';
import { IProgress } from './interfaces/progress.interface';
import { BarItem } from './bar-item';

export interface IOptions {
  refreshTimeMs: number;
}

export class Bar {
  public items: IBarItem[] = [];
  public started = false;
  protected nextUpdate: null | Promise<never> = null;
  protected timeOutId: NodeJS.Timeout | undefined;

  public constructor(
    protected terminal: ITerminal = new TerminalTty(),
    protected options?: IOptions,
  ) {
    this.options = {
      refreshTimeMs: 50,
      ...options,
    };
  }

  public isStarted() {
    return this.started;
  }

  public add(bar: IBarItem) {
    this.items.push(bar);
    if (this.started) {
      this.addListenerToProgress(bar);
    }
    return this;
  }

  public remove(bar: IBarItem) {
    const progresses = bar.getProgresses();
    if (!progresses.length) return;
    return this.removeByProgress(progresses[0]);
  }

  public addProgress(progress: IProgress) {
    return this.add(new BarItem(progress));
  }

  public removeByProgress(progress: IProgress) {
    this.items = this.items.filter(
      item => !item.getProgresses().find(p => p == progress),
    );
    this.reRender();
    return this;
  }

  public render() {
    const lines = this.items.map(bar => {
      return bar.render();
    });
    this.terminal.write(lines.join('\n') + '\n');
    return this;
  }

  public clean() {
    this.terminal.clear();
    return this;
  }

  public refresh() {
    this.terminal.refresh();
    return this;
  }

  public logWrap(logFunction: () => void) {
    this.terminal.clear();
    logFunction();
    this.terminal.refresh();
    return this;
  }

  public start() {
    this.started = true;
    this.items.forEach(item => this.addListenerToProgress(item));
    this.render();
    return this;
  }

  public stop() {
    this.items.forEach(item => this.removeListenersFromProgresses(item));
    clearTimeout(this.timeOutId);
    this.nextUpdate = null;
    this.started = false;
    return this;
  }

  protected addListenerToProgress(item: IBarItem) {
    item.getProgresses().forEach(progress => {
      progress.on('update', this.reRender);
    });
  }

  protected removeListenersFromProgresses(item: IBarItem) {
    item.getProgresses().forEach(progress => {
      progress.emitter.removeListener('update', this.reRender);
    });
  }

  protected reRender = () => {
    if (!this.started || this.nextUpdate !== null) {
      return;
    }
    this.nextUpdate = new Promise(resolve => {
      this.timeOutId = setTimeout(() => {
        this.nextUpdate = null;
        this.render();
        resolve(undefined);
      }, this.options.refreshTimeMs);
    });
  };
}
