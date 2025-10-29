import { SVD } from "../src/svd";

describe("SVD.sign", () => {
  it("returns |a| when b >= 0", () => {
    expect(SVD.sign(5, 2)).toBe(5);
    expect(SVD.sign(-5, 2)).toBe(5);
    expect(SVD.sign(0, 0)).toBe(0);
  });

  it("returns -|a| when b < 0", () => {
    expect(SVD.sign(5, -2)).toBe(-5);
    expect(SVD.sign(-5, -2)).toBe(-5);
  });
});

describe("SVD.pythag", () => {
  it("computes sqrt(a^2 + b^2) stably for various magnitudes", () => {
    expect(SVD.pythag(3, 4)).toBeCloseTo(5, 12);
    expect(SVD.pythag(0, 0)).toBeCloseTo(0, 12);

    // For extremely large magnitudes, use a relative error tolerance instead of toBeCloseTo,
    // because floating-point precision is limited to ~15-16 digits in JS numbers.
    const largeGot = SVD.pythag(1e154, 1e154);
    const largeExpected = 1.4142135623730951e154;
    const largeRelErr = Math.abs(largeGot - largeExpected) / largeExpected;
    expect(largeRelErr).toBeLessThan(1e-12);

    expect(SVD.pythag(1e-154, 1e-154)).toBeCloseTo(1.4142135623730951e-154, 12);
  });
});
