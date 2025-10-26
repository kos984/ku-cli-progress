import { SeededRandom } from '../seed-random';

describe('SeededRandom', () => {
  describe('constructor', () => {
    it('should initialize with positive seed', () => {
      const rnd = new SeededRandom(12345);
      expect(rnd.seed).toBe(12345);
    });

    it('should handle negative seed by adding 2147483646', () => {
      const rnd = new SeededRandom(-5);
      expect(rnd.seed).toBe(2147483641); // -5 + 2147483646
    });

    it('should handle zero seed by adding 2147483646', () => {
      const rnd = new SeededRandom(0);
      expect(rnd.seed).toBe(2147483646);
    });

    it('should handle large seed by modulo operation', () => {
      const rnd = new SeededRandom(3000000000);
      expect(rnd.seed).toBe(852516353); // 3000000000 % 2147483647
    });

    it('should handle large negative seed', () => {
      const rnd = new SeededRandom(-3000000000);
      expect(rnd.seed).toBe(1294967293); // (-3000000000 % 2147483647) + 2147483646
    });
  });

  describe('next', () => {
    it('should generate consistent values with same seed', () => {
      const rnd1 = new SeededRandom(12345);
      const rnd2 = new SeededRandom(12345);

      const values1 = [rnd1.next(), rnd1.next(), rnd1.next()];
      const values2 = [rnd2.next(), rnd2.next(), rnd2.next()];

      expect(values1).toEqual(values2);
    });

    it('should generate different values with different seeds', () => {
      const rnd1 = new SeededRandom(12345);
      const rnd2 = new SeededRandom(54321);

      const value1 = rnd1.next();
      const value2 = rnd2.next();

      expect(value1).not.toBe(value2);
    });

    it('should generate values between 0 and 1', () => {
      const rnd = new SeededRandom(12345);

      for (let i = 0; i < 100; i++) {
        const value = rnd.next();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('should update internal seed', () => {
      const rnd = new SeededRandom(12345);
      const initialSeed = rnd.seed;

      rnd.next();
      const newSeed = rnd.seed;

      expect(newSeed).not.toBe(initialSeed);
    });
  });

  describe('nextInRange', () => {
    it('should generate values within specified range', () => {
      const rnd = new SeededRandom(12345);

      for (let i = 0; i < 100; i++) {
        const value = rnd.nextInRange(5, 10);
        expect(value).toBeGreaterThanOrEqual(5);
        expect(value).toBeLessThanOrEqual(10);
      }
    });

    it('should handle single value range', () => {
      const rnd = new SeededRandom(12345);

      for (let i = 0; i < 10; i++) {
        const value = rnd.nextInRange(7, 7);
        expect(value).toBe(7);
      }
    });

    it('should handle negative range', () => {
      const rnd = new SeededRandom(12345);

      for (let i = 0; i < 100; i++) {
        const value = rnd.nextInRange(-10, -5);
        expect(value).toBeGreaterThanOrEqual(-10);
        expect(value).toBeLessThanOrEqual(-5);
      }
    });

    it('should generate consistent values with same seed', () => {
      const rnd1 = new SeededRandom(12345);
      const rnd2 = new SeededRandom(12345);

      const values1 = [
        rnd1.nextInRange(1, 10),
        rnd1.nextInRange(1, 10),
        rnd1.nextInRange(1, 10),
      ];
      const values2 = [
        rnd2.nextInRange(1, 10),
        rnd2.nextInRange(1, 10),
        rnd2.nextInRange(1, 10),
      ];

      expect(values1).toEqual(values2);
    });

    it('should handle large range', () => {
      const rnd = new SeededRandom(12345);

      for (let i = 0; i < 100; i++) {
        const value = rnd.nextInRange(1, 1000);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(1000);
      }
    });
  });
});
