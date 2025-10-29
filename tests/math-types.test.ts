import { Vec3, Mat3 } from "../src/math-types";

describe("Vec3", () => {
  test("constructor sets components (defaults to 0)", () => {
    const a = new Vec3();
    expect(a.v).toEqual([0, 0, 0]);

    const b = new Vec3(1, 2, 3);
    expect(b.v).toEqual([1, 2, 3]);
  });

  test("copy", () => {
    const a = new Vec3(4, 5, 6);
    const b = new Vec3();
    const ret = b.copy(a);
    expect(ret).toBe(b);
    expect(b.v).toEqual([4, 5, 6]);
  });

  test("add, sub, mult (component-wise)", () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, -1, 0.5);
    expect(Vec3.add(a, b).v).toEqual([5, 1, 3.5]);
    expect(Vec3.sub(a, b).v).toEqual([-3, 3, 2.5]);
    expect(Vec3.mult(a, b).v).toEqual([4, -2, 1.5]);
  });

  test("addScalar, multScalar", () => {
    const a = new Vec3(1, -2, 3);
    expect(Vec3.addScalar(a, 2).v).toEqual([3, 0, 5]);
    expect(Vec3.multScalar(a, -2).v).toEqual([-2, 4, -6]);
  });

  test("dot, cross", () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    expect(Vec3.dot(a, b)).toBe(1 * 4 + 2 * 5 + 3 * 6);
    const c = Vec3.cross(a, b).v;
    expect(c[0]).toBeCloseTo(2 * 6 - 3 * 5, 12);
    expect(c[1]).toBeCloseTo(3 * 4 - 1 * 6, 12);
    expect(c[2]).toBeCloseTo(1 * 5 - 2 * 4, 12);
  });

  test("normalize returns original length and scales vector to unit", () => {
    const a = new Vec3(3, 4, 0);
    const len = a.normalize();
    expect(len).toBeCloseTo(5, 12);
    const mag = Math.sqrt(a.v[0] ** 2 + a.v[1] ** 2 + a.v[2] ** 2);
    expect(mag).toBeCloseTo(1, 12);
  });

  test("inverse (component-wise reciprocal, zero stays zero)", () => {
    const a = new Vec3(2, -4, 0);
    const inv = Vec3.inverse(a).v;
    expect(inv[0]).toBeCloseTo(0.5, 12);
    expect(inv[1]).toBeCloseTo(-0.25, 12);
    expect(inv[2]).toBeCloseTo(0, 12);
  });

  test("square and minIndex", () => {
    const a = new Vec3(2, -3, 1);
    expect(a.square()).toBe(4 + 9 + 1);
    // Components: [2, -3, 1] -> min value is -3 at index 1
    expect(a.minIndex()).toBe(1);

    const b = new Vec3(0.1, 10, 0.05);
    expect(b.minIndex()).toBe(2);
  });
});

describe("Mat3", () => {
  test("fromRows builds matrix with given rows", () => {
    const r0 = new Vec3(1, 2, 3);
    const r1 = new Vec3(4, 5, 6);
    const r2 = new Vec3(7, 8, 9);
    const m = Mat3.fromRows(r0, r1, r2).m;
    expect(m).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });

  test("fromDiagonal", () => {
    const d = new Vec3(1, 2, 3);
    const m = Mat3.fromDiagonal(d).m;
    expect(m[0][0]).toBe(1);
    expect(m[1][1]).toBe(2);
    expect(m[2][2]).toBe(3);
    // Non-diagonal entries should stay 0
    expect(m[0][1]).toBe(0);
    expect(m[0][2]).toBe(0);
    expect(m[1][0]).toBe(0);
    expect(m[1][2]).toBe(0);
    expect(m[2][0]).toBe(0);
    expect(m[2][1]).toBe(0);
  });

  test("transpose", () => {
    const r0 = new Vec3(1, 2, 3);
    const r1 = new Vec3(4, 5, 6);
    const r2 = new Vec3(7, 8, 9);
    const m = Mat3.fromRows(r0, r1, r2);
    const t = Mat3.transpose(m).m;
    expect(t).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
  });

  test("clone and copy", () => {
    const m = Mat3.fromRows(
      new Vec3(1, 2, 3),
      new Vec3(4, 5, 6),
      new Vec3(7, 8, 9)
    );
    const c = Mat3.clone(m);
    expect(c.m).toEqual(m.m);

    const other = new Mat3();
    const ret = other.copy(m);
    expect(ret).toBe(other);
    expect(other.m).toEqual(m.m);
  });

  test("mult (matrix * matrix)", () => {
    // Use two simple matrices and verify product
    const A = Mat3.fromRows(
      new Vec3(1, 2, 3),
      new Vec3(0, 1, 4),
      new Vec3(5, 6, 0)
    );
    const B = Mat3.fromRows(
      new Vec3(-2, 1, 0),
      new Vec3(3, 0, 0),
      new Vec3(4, -1, 2)
    );
    const C = Mat3.mult(A, B).m;
    expect(C).toEqual([
      [1 * -2 + 2 * 3 + 3 * 4, 1 * 1 + 2 * 0 + 3 * -1, 1 * 0 + 2 * 0 + 3 * 2],
      [0 * -2 + 1 * 3 + 4 * 4, 0 * 1 + 1 * 0 + 4 * -1, 0 * 0 + 1 * 0 + 4 * 2],
      [5 * -2 + 6 * 3 + 0 * 4, 5 * 1 + 6 * 0 + 0 * -1, 5 * 0 + 6 * 0 + 0 * 2],
    ]);
  });

  test("multVector (matrix * vector)", () => {
    const M = Mat3.fromRows(
      new Vec3(1, 2, 3),
      new Vec3(0, 1, 4),
      new Vec3(5, 6, 0)
    );
    const v = new Vec3(1, 0.5, -2);
    const r = Mat3.multVector(M, v).v;
    expect(r[0]).toBeCloseTo(1 * 1 + 2 * 0.5 + 3 * -2, 12);
    expect(r[1]).toBeCloseTo(0 * 1 + 1 * 0.5 + 4 * -2, 12);
    expect(r[2]).toBeCloseTo(5 * 1 + 6 * 0.5 + 0 * -2, 12);
  });

  test("row and column accessors", () => {
    const m = Mat3.fromRows(
      new Vec3(1, 2, 3),
      new Vec3(4, 5, 6),
      new Vec3(7, 8, 9)
    );
    expect(m.row(0).v).toEqual([1, 2, 3]);
    expect(m.row(1).v).toEqual([4, 5, 6]);
    expect(m.row(2).v).toEqual([7, 8, 9]);

    expect(m.column(0).v).toEqual([1, 4, 7]);
    expect(m.column(1).v).toEqual([2, 5, 8]);
    expect(m.column(2).v).toEqual([3, 6, 9]);
  });
});
