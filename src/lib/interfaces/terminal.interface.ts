export interface ITerminal {
  write(s: string): void;
  cursor(enabled: boolean): void;
  clear(): void;
  refresh(): void;
}
