import { IProgress } from '../../interfaces/progress.interface';

export class BarDataResult {
  public constructor(
    protected parts: { str: string; progress: IProgress | undefined }[],
    protected glue: string = '',
  ) {}

  toString() {
    return this.parts.map(a => a.str).join(this.glue);
  }

  public *[Symbol.iterator](): Generator<
    { str: string; progress: IProgress },
    void,
    unknown
  > {
    for (const item of this.parts) {
      yield item;
    }
  }
}
