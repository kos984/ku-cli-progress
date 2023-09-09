export interface IEta {
  update(value: number, total: number): IEta;
  set(count: number): IEta;
  getSpeed(): number;
  getEtaS(): number;
  getDurationMs(): number;
}
