import { IProgress } from '../../interfaces/progress.interface';

export interface IBarDataResultPart {
  str: string;
  progress: IProgress | undefined;
}

export class BarDataResult {
  public constructor(
    protected parts: IBarDataResultPart[],
    protected glue: string = '',
  ) {}

  toString() {
    return this.parts.map(a => a.str).join(this.glue);
  }

  public getParts(): IBarDataResultPart[] {
    return this.parts;
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
