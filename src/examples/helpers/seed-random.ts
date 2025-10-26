export class SeededRandom {
  public seed: number;

  public constructor(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  public next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  nextInRange(min, max): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
