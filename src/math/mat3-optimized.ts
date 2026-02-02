import { Vec3 } from "./vec3-optimized";

export class Mat3 {
  public data: Float32Array;

  constructor() {
    this.data = new Float32Array(9);
  }

  // Backwards compatibility
  get m(): number[][] {
    const d = this.data;
    return [
      [d[0], d[1], d[2]],
      [d[3], d[4], d[5]],
      [d[6], d[7], d[8]],
    ];
  }

  set m(matrix: number[][]) {
    this.data[0] = matrix[0][0];
    this.data[1] = matrix[0][1];
    this.data[2] = matrix[0][2];
    this.data[3] = matrix[1][0];
    this.data[4] = matrix[1][1];
    this.data[5] = matrix[1][2];
    this.data[6] = matrix[2][0];
    this.data[7] = matrix[2][1];
    this.data[8] = matrix[2][2];
  }

  get(row: number, col: number): number {
    return this.data[row * 3 + col];
  }

  set(row: number, col: number, value: number): void {
    this.data[row * 3 + col] = value;
  }

  // In-place operations
  transposeInPlace(): this {
    const d = this.data;
    // Swap elements across the diagonal
    let temp = d[1];
    d[1] = d[3];
    d[3] = temp;

    temp = d[2];
    d[2] = d[6];
    d[6] = temp;

    temp = d[5];
    d[5] = d[7];
    d[7] = temp;

    return this;
  }

  // Output parameter variants
  static mult(a: Mat3, b: Mat3, out: Mat3): Mat3 {
    const ad = a.data;
    const bd = b.data;
    const od = out.data;

    // Row 0
    od[0] = ad[0] * bd[0] + ad[1] * bd[3] + ad[2] * bd[6];
    od[1] = ad[0] * bd[1] + ad[1] * bd[4] + ad[2] * bd[7];
    od[2] = ad[0] * bd[2] + ad[1] * bd[5] + ad[2] * bd[8];

    // Row 1
    od[3] = ad[3] * bd[0] + ad[4] * bd[3] + ad[5] * bd[6];
    od[4] = ad[3] * bd[1] + ad[4] * bd[4] + ad[5] * bd[7];
    od[5] = ad[3] * bd[2] + ad[4] * bd[5] + ad[5] * bd[8];

    // Row 2
    od[6] = ad[6] * bd[0] + ad[7] * bd[3] + ad[8] * bd[6];
    od[7] = ad[6] * bd[1] + ad[7] * bd[4] + ad[8] * bd[7];
    od[8] = ad[6] * bd[2] + ad[7] * bd[5] + ad[8] * bd[8];

    return out;
  }

  static multVector(m: Mat3, v: Vec3, out: Vec3): Vec3 {
    const md = m.data;
    const vd = v.data;

    const x = md[0] * vd[0] + md[1] * vd[1] + md[2] * vd[2];
    const y = md[3] * vd[0] + md[4] * vd[1] + md[5] * vd[2];
    const z = md[6] * vd[0] + md[7] * vd[1] + md[8] * vd[2];

    out.data[0] = x;
    out.data[1] = y;
    out.data[2] = z;

    return out;
  }

  static transpose(a: Mat3, out: Mat3): Mat3 {
    const ad = a.data;
    const od = out.data;

    od[0] = ad[0];
    od[1] = ad[3];
    od[2] = ad[6];
    od[3] = ad[1];
    od[4] = ad[4];
    od[5] = ad[7];
    od[6] = ad[2];
    od[7] = ad[5];
    od[8] = ad[8];

    return out;
  }

  // Backwards compatible (allocating versions)
  static multNew(a: Mat3, b: Mat3): Mat3 {
    const out = new Mat3();
    return Mat3.mult(a, b, out);
  }

  static transposeNew(a: Mat3): Mat3 {
    const out = new Mat3();
    return Mat3.transpose(a, out);
  }

  static multVectorNew(m: Mat3, v: Vec3): Vec3 {
    const out = new Vec3();
    return Mat3.multVector(m, v, out);
  }

  // Existing methods
  static clone(a: Mat3): Mat3 {
    const matrix = new Mat3();
    matrix.data.set(a.data);
    return matrix;
  }

  copy(a: Mat3): this {
    this.data.set(a.data);
    return this;
  }

  static fromRows(a: Vec3, b: Vec3, c: Vec3): Mat3 {
    const matrix = new Mat3();
    const d = matrix.data;

    d[0] = a.data[0];
    d[1] = a.data[1];
    d[2] = a.data[2];
    d[3] = b.data[0];
    d[4] = b.data[1];
    d[5] = b.data[2];
    d[6] = c.data[0];
    d[7] = c.data[1];
    d[8] = c.data[2];

    return matrix;
  }

  static fromDiagonal(a: Vec3): Mat3 {
    const matrix = new Mat3();
    const d = matrix.data;

    d[0] = a.data[0];
    d[4] = a.data[1];
    d[8] = a.data[2];

    return matrix;
  }

  static identity(): Mat3 {
    const matrix = new Mat3();
    const d = matrix.data;

    d[0] = 1;
    d[4] = 1;
    d[8] = 1;

    return matrix;
  }

  column(index: number): Vec3 {
    const d = this.data;
    return new Vec3(d[index], d[3 + index], d[6 + index]);
  }

  row(index: number): Vec3 {
    const d = this.data;
    const offset = index * 3;
    return new Vec3(d[offset], d[offset + 1], d[offset + 2]);
  }
}
