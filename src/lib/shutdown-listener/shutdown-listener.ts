import { IShutdownListener } from './shutdown-listener.interface';

type ICleanupFunction = () => void | Promise<void>;
type IShutdownListenerProcess = Pick<
  NodeJS.Process,
  'on' | 'removeListener' | 'kill' | 'pid'
>;

export class ShutdownListener implements IShutdownListener {
  protected isSignalReceived: boolean = false;
  protected isAttached: boolean = false;

  protected signals: string[];
  protected process: IShutdownListenerProcess;
  protected cleanupFunction!: ICleanupFunction;
  protected handler = this.handlerTemplate.bind(this);

  public constructor(params: {
    signals?: string[];
    cleanupFunction: ICleanupFunction;
    process?: IShutdownListenerProcess;
  }) {
    this.signals = params.signals ?? ['SIGINT', 'SIGTERM'];
    this.process = params.process ?? process;
    this.cleanupFunction = params.cleanupFunction;
  }

  protected handlerTemplate(signal: string) {
    if (this.isSignalReceived) {
      return;
    }
    this.isSignalReceived = true;
    Promise.resolve(
      (async () => {
        // force function to be async
        return this.cleanupFunction();
      })(),
    )
      .catch(e => {
        this.removeListener();
        throw e;
      })
      .then(() => {
        this.removeListener();
        this.process.kill(this.process.pid, signal);
      });
  }

  protected removeListener() {
    this.signals.forEach(sig => this.process.removeListener(sig, this.handler));
  }

  public attach() {
    if (this.isAttached) {
      return;
    }
    this.signals.forEach(sig => {
      this.process.on(sig, this.handler);
    });
    this.isAttached = true;
    return this;
  }

  public detach() {
    if (this.isSignalReceived) {
      return;
    }
    this.signals.forEach(sig => this.process.removeListener(sig, this.handler));
    this.isAttached = false;
    return this;
  }
}
