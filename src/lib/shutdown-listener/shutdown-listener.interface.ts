export interface IShutdownListener {
  attach(): IShutdownListener;
  detach(): IShutdownListener;
}
