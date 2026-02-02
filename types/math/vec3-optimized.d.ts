export declare class Vec3 {
  data: Float32Array;

  constructor(x?: number, y?: number, z?: number);

  // Backwards compatibility
  get v(): number[];
  set v(arr: number[]);

  // Accessors
  get x(): number;
  set x(val: number);
  get y(): number;
  set y(val: number);
  get z(): number;
  set z(val: number);

  // In-place operations
  addInPlace(other: Vec3): this;
  subInPlace(other: Vec3): this;
  multScalarInPlace(scalar: number): this;
  normalizeInPlace(): number;

  // Output parameter variants (no allocation)
  static add(a: Vec3, b: Vec3, out: Vec3): Vec3;
  static sub(a: Vec3, b: Vec3, out: Vec3): Vec3;
  static mult(a: Vec3, b: Vec3, out: Vec3): Vec3;
  static cross(a: Vec3, b: Vec3, out: Vec3): Vec3;
  static multScalar(a: Vec3, scalar: number, out: Vec3): Vec3;
  static addScalar(a: Vec3, scalar: number, out: Vec3): Vec3;

  // Backwards compatible (allocating versions)
  static addNew(a: Vec3, b: Vec3): Vec3;
  static subNew(a: Vec3, b: Vec3): Vec3;
  static multNew(a: Vec3, b: Vec3): Vec3;
  static crossNew(a: Vec3, b: Vec3): Vec3;
  static multScalarNew(a: Vec3, scalar: number): Vec3;
  static addScalarNew(a: Vec3, scalar: number): Vec3;

  // Existing methods
  copy(other: Vec3): this;
  clone(): Vec3;
  static dot(a: Vec3, b: Vec3): number;
  static inverse(a: Vec3): Vec3;
  square(): number;
  minIndex(): number;
  normalize(): number;
}
