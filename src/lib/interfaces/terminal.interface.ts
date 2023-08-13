export interface ITerminal {
  write(s: string): void
  clear(): void;
  refresh(): void;
}
