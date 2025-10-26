import { TerminalTty } from './terminals/terminal-tty';
import { ITerminal } from './interfaces/terminal.interface';
import { IBarItem } from './interfaces/bar-item.interface';
import { IProgress } from './interfaces/progress.interface';
import { BarItem } from './bar-items/bar-item';
import { ShutdownListener } from './shutdown-listener/shutdown-listener';
import { IShutdownListener } from './shutdown-listener/shutdown-listener.interface';

export interface IOptions {
  refreshTimeMs: number;
  disableCursor?: boolean;
  addNewLineAfterProgress?: boolean;
  enableCursorOnShutdown?: boolean;
  shutdownListener?: IShutdownListener;
}

export class Bar {
  protected items: IBarItem[] = [];
  protected started = false;
  protected nextUpdate: null | Promise<never> = null;
  protected timeOutId: NodeJS.Timeout | undefined;
  protected refreshInterval?: NodeJS.Timeout | undefined;
  protected shutdownListener?: ShutdownListener | undefined;

  public constructor(
    protected terminal: ITerminal = new TerminalTty(),
    protected options?: IOptions,
  ) {
    this.options = {
      refreshTimeMs: 300,
      disableCursor: false,
      addNewLineAfterProgress: true,
      enableCursorOnShutdown: false,
      ...options,
    };
    if (this.options.shutdownListener) {
      this.shutdownListener = this.options.shutdownListener as ShutdownListener;
    } else if (this.options.enableCursorOnShutdown === true) {
      this.shutdownListener = new ShutdownListener({
        cleanupFunction: () => {
          this.terminal.cursor(true);
        },
      }).attach();
    }
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

  public addProgress(progress: IProgress) {
    return this.add(new BarItem(progress));
  }

  public getItems(): IBarItem[] {
    return this.items;
  }

  public remove(bar: IBarItem) {
    const progresses = bar.getProgresses();
    if (!progresses.length) return;
    return this.removeByProgress(progresses[0]);
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
    const newLine = this.options.addNewLineAfterProgress ? '\n' : '';
    this.terminal.write(lines.join('\n') + newLine);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public wrapLogger<T extends Record<string, any>>(logger: T): T {
    return new Proxy(logger, {
      get: (target, prop) => {
        if (typeof prop === 'symbol') {
          return;
        }
        if (typeof target[prop] === 'function') {
          return (...params) => {
            this.terminal.clear();
            target[prop](...params);
            this.terminal.refresh();
          };
        }
        return target[prop];
      },
    });
  }

  public logWrap(logFunction: () => void) {
    this.terminal.clear();
    logFunction();
    this.terminal.refresh();
    return this;
  }

  public start(autoRefresh = 0) {
    this.started = true;
    this.items.forEach(item => this.addListenerToProgress(item));
    this.render();
    if (autoRefresh) {
      this.refreshInterval = setInterval(() => this.render(), autoRefresh);
    }
    if (this.options.disableCursor) this.terminal.cursor(false);
    return this;
  }

  public stop() {
    this.render();
    this.items.forEach(item => this.removeListenersFromProgresses(item));
    clearTimeout(this.timeOutId);
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    if (this.options.disableCursor) this.terminal.cursor(true);
    this.shutdownListener?.detach();
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
