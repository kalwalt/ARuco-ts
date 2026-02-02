import { Vec3 } from "./vec3-optimized";

export declare class Mat3 {
  data: Float32Array;

  constructor();

  // Backwards compatibility
  get m(): number[][];
  set m(matrix: number[][]);

  get(row: number, col: number): number;
  set(row: number, col: number, value: number): void;

  // In-place operations
  transposeInPlace(): this;

  // Output parameter variants
  static mult(a: Mat3, b: Mat3, out: Mat3): Mat3;
  static multVector(m: Mat3, v: Vec3, out: Vec3): Vec3;
  static transpose(a: Mat3, out: Mat3): Mat3;

  // Backwards compatible (allocating versions)
  static multNew(a: Mat3, b: Mat3): Mat3;
  static transposeNew(a: Mat3): Mat3;
  static multVectorNew(m: Mat3, v: Vec3): Vec3;

  // Existing methods
  static clone(a: Mat3): Mat3;
  copy(a: Mat3): this;
  static fromRows(a: Vec3, b: Vec3, c: Vec3): Mat3;
  static fromDiagonal(a: Vec3): Mat3;
  static identity(): Mat3;
  column(index: number): Vec3;
  row(index: number): Vec3;
}
