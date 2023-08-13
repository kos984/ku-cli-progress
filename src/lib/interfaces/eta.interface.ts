import { IProgress, IUpdateEvent } from './progress.interface';

export interface IEta {
  attachProgress(progress: IProgress): IEta;
  update(params: IUpdateEvent): IEta;
  set(count: number): IEta;
  getSpeed(): number;
  getEtaS(): number;
  getDurationMs(): number;
}
