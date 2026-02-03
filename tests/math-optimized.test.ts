import { Vec3, Mat3 } from "../src/math";
import { Vec3 as Vec3Legacy, Mat3 as Mat3Legacy } from "../src/math-types";

describe("Vec3 Optimized", () => {
  describe("Construction and properties", () => {
    it("creates with Float32Array storage", () => {
      const v = new Vec3(1, 2, 3);
      expect(v.data).toBeInstanceOf(Float32Array);
      expect(v.data.length).toBe(3);
    });

    it("maintains backwards compatible v property", () => {
      const v = new Vec3(1, 2, 3);
      expect(v.v).toEqual([1, 2, 3]);
      expect(Array.isArray(v.v)).toBe(true);
    });

    it("supports x, y, z accessors (get)", () => {
      const v = new Vec3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });

    it("supports x, y, z accessors (set)", () => {
      const v = new Vec3(1, 2, 3);
      v.x = 4;
      v.y = 5;
      v.z = 6;
      expect(v.data[0]).toBe(4);
      expect(v.data[1]).toBe(5);
      expect(v.data[2]).toBe(6);
    });

    it("v setter updates data", () => {
      const v = new Vec3(1, 2, 3);
      v.v = [7, 8, 9];
      expect(v.data[0]).toBe(7);
      expect(v.data[1]).toBe(8);
      expect(v.data[2]).toBe(9);
    });

    it("creates with default values of 0", () => {
      const v = new Vec3();
      expect(v.v).toEqual([0, 0, 0]);
    });
  });

  describe("In-place operations", () => {
    it("addInPlace modifies vector without allocation", () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      const result = v1.addInPlace(v2);
      expect(result).toBe(v1); // Same instance
      expect(v1.v).toEqual([5, 7, 9]);
    });

    it("subInPlace modifies vector without allocation", () => {
      const v1 = new Vec3(5, 7, 9);
      const v2 = new Vec3(1, 2, 3);
      const result = v1.subInPlace(v2);
      expect(result).toBe(v1);
      expect(v1.v).toEqual([4, 5, 6]);
    });

    it("multScalarInPlace modifies vector", () => {
      const v = new Vec3(1, 2, 3);
      const result = v.multScalarInPlace(2);
      expect(result).toBe(v);
      expect(v.v).toEqual([2, 4, 6]);
    });

    it("normalizeInPlace modifies vector", () => {
      const v = new Vec3(3, 4, 0);
      const len = v.normalizeInPlace();
      expect(len).toBe(5);
      expect(v.x).toBeCloseTo(0.6, 5);
      expect(v.y).toBeCloseTo(0.8, 5);
      expect(v.z).toBeCloseTo(0, 5);
    });
  });

  describe("Output parameter operations", () => {
    it("add with output parameter", () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      const out = new Vec3();
      const result = Vec3.add(v1, v2, out);
      expect(result).toBe(out);
      expect(out.v).toEqual([5, 7, 9]);
      // Original vectors unchanged
      expect(v1.v).toEqual([1, 2, 3]);
      expect(v2.v).toEqual([4, 5, 6]);
    });

    it("sub with output parameter", () => {
      const v1 = new Vec3(5, 7, 9);
      const v2 = new Vec3(1, 2, 3);
      const out = new Vec3();
      Vec3.sub(v1, v2, out);
      expect(out.v).toEqual([4, 5, 6]);
    });

    it("mult with output parameter", () => {
      const v1 = new Vec3(2, 3, 4);
      const v2 = new Vec3(5, 6, 7);
      const out = new Vec3();
      Vec3.mult(v1, v2, out);
      expect(out.v).toEqual([10, 18, 28]);
    });

    it("cross product with output", () => {
      const v1 = new Vec3(1, 0, 0);
      const v2 = new Vec3(0, 1, 0);
      const out = new Vec3();
      Vec3.cross(v1, v2, out);
      expect(out.v).toEqual([0, 0, 1]);
    });

    it("multScalar with output parameter", () => {
      const v = new Vec3(1, 2, 3);
      const out = new Vec3();
      Vec3.multScalar(v, 3, out);
      expect(out.v).toEqual([3, 6, 9]);
      expect(v.v).toEqual([1, 2, 3]);
    });

    it("addScalar with output parameter", () => {
      const v = new Vec3(1, 2, 3);
      const out = new Vec3();
      Vec3.addScalar(v, 5, out);
      expect(out.v).toEqual([6, 7, 8]);
      expect(v.v).toEqual([1, 2, 3]);
    });
  });

  describe("Static operations (backwards compatible)", () => {
    it("dot product", () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      expect(Vec3.dot(v1, v2)).toBe(32);
    });

    it("addNew creates new vector", () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      const result = Vec3.addNew(v1, v2);
      expect(result).not.toBe(v1);
      expect(result).not.toBe(v2);
      expect(result.v).toEqual([5, 7, 9]);
    });

    it("subNew creates new vector", () => {
      const v1 = new Vec3(5, 7, 9);
      const v2 = new Vec3(1, 2, 3);
      const result = Vec3.subNew(v1, v2);
      expect(result.v).toEqual([4, 5, 6]);
    });

    it("multNew creates new vector", () => {
      const v1 = new Vec3(2, 3, 4);
      const v2 = new Vec3(5, 6, 7);
      const result = Vec3.multNew(v1, v2);
      expect(result.v).toEqual([10, 18, 28]);
    });

    it("crossNew creates new vector", () => {
      const v1 = new Vec3(1, 0, 0);
      const v2 = new Vec3(0, 1, 0);
      const result = Vec3.crossNew(v1, v2);
      expect(result.v).toEqual([0, 0, 1]);
    });

    it("multScalarNew creates new vector", () => {
      const v = new Vec3(1, 2, 3);
      const result = Vec3.multScalarNew(v, 3);
      expect(result.v).toEqual([3, 6, 9]);
    });

    it("addScalarNew creates new vector", () => {
      const v = new Vec3(1, 2, 3);
      const result = Vec3.addScalarNew(v, 5);
      expect(result.v).toEqual([6, 7, 8]);
    });

    it("inverse", () => {
      const v = new Vec3(2, -4, 0);
      const inv = Vec3.inverse(v);
      expect(inv.v[0]).toBeCloseTo(0.5, 12);
      expect(inv.v[1]).toBeCloseTo(-0.25, 12);
      expect(inv.v[2]).toBeCloseTo(0, 12);
    });
  });

  describe("Instance methods", () => {
    it("copy", () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = new Vec3(4, 5, 6);
      const result = v2.copy(v1);
      expect(result).toBe(v2);
      expect(v2.v).toEqual([1, 2, 3]);
    });

    it("clone", () => {
      const v1 = new Vec3(1, 2, 3);
      const v2 = v1.clone();
      expect(v2).not.toBe(v1);
      expect(v2.v).toEqual([1, 2, 3]);
    });

    it("square", () => {
      const v = new Vec3(2, -3, 1);
      expect(v.square()).toBe(14);
    });

    it("minIndex", () => {
      const v1 = new Vec3(2, -3, 1);
      expect(v1.minIndex()).toBe(1);

      const v2 = new Vec3(0.1, 10, 0.05);
      expect(v2.minIndex()).toBe(2);
    });

    it("normalize", () => {
      const v = new Vec3(3, 4, 0);
      const len = v.normalize();
      expect(len).toBeCloseTo(5, 12);
      const mag = Math.sqrt(v.v[0] ** 2 + v.v[1] ** 2 + v.v[2] ** 2);
      expect(mag).toBeCloseTo(1, 5);
    });
  });

  describe("Edge cases", () => {
    it("normalizeInPlace with zero vector", () => {
      const v = new Vec3(0, 0, 0);
      const len = v.normalizeInPlace();
      expect(len).toBe(0);
      expect(v.v).toEqual([0, 0, 0]);
    });

    it("inverse with zero components", () => {
      const v = new Vec3(0, 2, 0);
      const inv = Vec3.inverse(v);
      expect(inv.v[0]).toBe(0);
      expect(inv.v[1]).toBeCloseTo(0.5, 12);
      expect(inv.v[2]).toBe(0);
    });
  });
});

describe("Mat3 Optimized", () => {
  describe("Construction and properties", () => {
    it("creates with Float32Array storage", () => {
      const m = new Mat3();
      expect(m.data).toBeInstanceOf(Float32Array);
      expect(m.data.length).toBe(9);
    });

    it("maintains backwards compatible m property", () => {
      const m = Mat3.identity();
      expect(m.m).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    });

    it("get/set methods work correctly", () => {
      const m = new Mat3();
      m.set(1, 2, 42);
      expect(m.get(1, 2)).toBe(42);
      expect(m.data[5]).toBe(42); // row 1, col 2 = index 5
    });

    it("m setter updates data", () => {
      const m = new Mat3();
      m.m = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      expect(m.data[0]).toBe(1);
      expect(m.data[4]).toBe(5);
      expect(m.data[8]).toBe(9);
    });
  });

  describe("Matrix operations", () => {
    it("matrix multiplication with output", () => {
      const m1 = Mat3.identity();
      const m2 = Mat3.identity();
      m2.set(0, 0, 2);
      const out = new Mat3();
      const result = Mat3.mult(m1, m2, out);
      expect(result).toBe(out);
      expect(out.get(0, 0)).toBe(2);
    });

    it("matrix-vector multiplication with output", () => {
      const m = Mat3.identity();
      m.set(0, 0, 2);
      const v = new Vec3(1, 2, 3);
      const out = new Vec3();
      const result = Mat3.multVector(m, v, out);
      expect(result).toBe(out);
      expect(out.v).toEqual([2, 2, 3]);
    });

    it("transpose with output", () => {
      const m = new Mat3();
      m.set(0, 1, 5);
      m.set(1, 0, 7);
      const out = new Mat3();
      Mat3.transpose(m, out);
      expect(out.get(0, 1)).toBe(7);
      expect(out.get(1, 0)).toBe(5);
    });

    it("transpose in-place", () => {
      const m = new Mat3();
      m.set(0, 1, 5);
      m.set(1, 0, 7);
      m.set(0, 2, 3);
      m.set(2, 0, 4);
      m.transposeInPlace();
      expect(m.get(0, 1)).toBe(7);
      expect(m.get(1, 0)).toBe(5);
      expect(m.get(0, 2)).toBe(4);
      expect(m.get(2, 0)).toBe(3);
    });

    it("multNew creates new matrix", () => {
      const m1 = Mat3.identity();
      const m2 = Mat3.identity();
      m2.set(0, 0, 3);
      const result = Mat3.multNew(m1, m2);
      expect(result).not.toBe(m1);
      expect(result).not.toBe(m2);
      expect(result.get(0, 0)).toBe(3);
    });

    it("transposeNew creates new matrix", () => {
      const m = new Mat3();
      m.set(0, 1, 5);
      const result = Mat3.transposeNew(m);
      expect(result).not.toBe(m);
      expect(result.get(1, 0)).toBe(5);
    });

    it("multVectorNew creates new vector", () => {
      const m = Mat3.identity();
      const v = new Vec3(1, 2, 3);
      const result = Mat3.multVectorNew(m, v);
      expect(result).not.toBe(v);
      expect(result.v).toEqual([1, 2, 3]);
    });
  });

  describe("Static construction methods", () => {
    it("fromRows", () => {
      const r0 = new Vec3(1, 2, 3);
      const r1 = new Vec3(4, 5, 6);
      const r2 = new Vec3(7, 8, 9);
      const m = Mat3.fromRows(r0, r1, r2);
      expect(m.m).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
    });

    it("fromDiagonal", () => {
      const d = new Vec3(1, 2, 3);
      const m = Mat3.fromDiagonal(d);
      expect(m.get(0, 0)).toBe(1);
      expect(m.get(1, 1)).toBe(2);
      expect(m.get(2, 2)).toBe(3);
      expect(m.get(0, 1)).toBe(0);
      expect(m.get(0, 2)).toBe(0);
    });

    it("identity", () => {
      const m = Mat3.identity();
      expect(m.get(0, 0)).toBe(1);
      expect(m.get(1, 1)).toBe(1);
      expect(m.get(2, 2)).toBe(1);
      expect(m.get(0, 1)).toBe(0);
      expect(m.get(1, 2)).toBe(0);
    });

    it("clone", () => {
      const m1 = Mat3.identity();
      const m2 = Mat3.clone(m1);
      expect(m2).not.toBe(m1);
      expect(m2.m).toEqual(m1.m);
    });
  });

  describe("Instance methods", () => {
    it("copy", () => {
      const m1 = Mat3.identity();
      const m2 = new Mat3();
      const result = m2.copy(m1);
      expect(result).toBe(m2);
      expect(m2.m).toEqual(m1.m);
    });

    it("row accessor", () => {
      const m = Mat3.fromRows(
        new Vec3(1, 2, 3),
        new Vec3(4, 5, 6),
        new Vec3(7, 8, 9)
      );
      expect(m.row(0).v).toEqual([1, 2, 3]);
      expect(m.row(1).v).toEqual([4, 5, 6]);
      expect(m.row(2).v).toEqual([7, 8, 9]);
    });

    it("column accessor", () => {
      const m = Mat3.fromRows(
        new Vec3(1, 2, 3),
        new Vec3(4, 5, 6),
        new Vec3(7, 8, 9)
      );
      expect(m.column(0).v).toEqual([1, 4, 7]);
      expect(m.column(1).v).toEqual([2, 5, 8]);
      expect(m.column(2).v).toEqual([3, 6, 9]);
    });
  });

  describe("Complex operations", () => {
    it("matrix multiplication correctness", () => {
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
      const out = new Mat3();
      Mat3.mult(A, B, out);
      expect(out.m).toEqual([
        [1 * -2 + 2 * 3 + 3 * 4, 1 * 1 + 2 * 0 + 3 * -1, 1 * 0 + 2 * 0 + 3 * 2],
        [0 * -2 + 1 * 3 + 4 * 4, 0 * 1 + 1 * 0 + 4 * -1, 0 * 0 + 1 * 0 + 4 * 2],
        [5 * -2 + 6 * 3 + 0 * 4, 5 * 1 + 6 * 0 + 0 * -1, 5 * 0 + 6 * 0 + 0 * 2],
      ]);
    });

    it("matrix-vector multiplication correctness", () => {
      const M = Mat3.fromRows(
        new Vec3(1, 2, 3),
        new Vec3(0, 1, 4),
        new Vec3(5, 6, 0)
      );
      const v = new Vec3(1, 0.5, -2);
      const out = new Vec3();
      Mat3.multVector(M, v, out);
      expect(out.v[0]).toBeCloseTo(1 * 1 + 2 * 0.5 + 3 * -2, 12);
      expect(out.v[1]).toBeCloseTo(0 * 1 + 1 * 0.5 + 4 * -2, 12);
      expect(out.v[2]).toBeCloseTo(5 * 1 + 6 * 0.5 + 0 * -2, 12);
    });
  });
});

describe("Backwards Compatibility", () => {
  it("Vec3 legacy static methods still work", () => {
    const v1 = new Vec3Legacy(1, 2, 3);
    const v2 = new Vec3Legacy(4, 5, 6);
    const result = Vec3Legacy.add(v1, v2);
    expect(result.v).toEqual([5, 7, 9]);
  });

  it("Mat3 legacy static methods still work", () => {
    const m1 = Mat3Legacy.fromRows(
      new Vec3Legacy(1, 0, 0),
      new Vec3Legacy(0, 1, 0),
      new Vec3Legacy(0, 0, 1)
    );
    const m2 = Mat3Legacy.clone(m1);
    expect(m2.m).toEqual(m1.m);
  });

  it("Optimized Vec3 has same API surface as legacy", () => {
    const v = new Vec3(1, 2, 3);
    const vLegacy = new Vec3Legacy(1, 2, 3);

    // Check that properties exist
    expect(v.v).toBeDefined();
    expect(vLegacy.v).toBeDefined();

    // Check methods
    expect(typeof v.copy).toBe("function");
    expect(typeof v.normalize).toBe("function");
    expect(typeof v.square).toBe("function");
    expect(typeof v.minIndex).toBe("function");
  });
});
