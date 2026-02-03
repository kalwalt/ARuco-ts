export class Vec3 {
  public data: Float32Array;

  constructor(x = 0, y = 0, z = 0) {
    this.data = new Float32Array([x, y, z]);
  }

  // Backwards compatibility
  get v(): number[] {
    return Array.from(this.data);
  }

  set v(arr: number[]) {
    this.data[0] = arr[0] || 0;
    this.data[1] = arr[1] || 0;
    this.data[2] = arr[2] || 0;
  }

  // Accessors
  get x(): number {
    return this.data[0];
  }

  set x(val: number) {
    this.data[0] = val;
  }

  get y(): number {
    return this.data[1];
  }

  set y(val: number) {
    this.data[1] = val;
  }

  get z(): number {
    return this.data[2];
  }

  set z(val: number) {
    this.data[2] = val;
  }

  // In-place operations
  addInPlace(other: Vec3): this {
    this.data[0] += other.data[0];
    this.data[1] += other.data[1];
    this.data[2] += other.data[2];
    return this;
  }

  subInPlace(other: Vec3): this {
    this.data[0] -= other.data[0];
    this.data[1] -= other.data[1];
    this.data[2] -= other.data[2];
    return this;
  }

  multScalarInPlace(scalar: number): this {
    this.data[0] *= scalar;
    this.data[1] *= scalar;
    this.data[2] *= scalar;
    return this;
  }

  normalizeInPlace(): number {
    const len = Math.sqrt(
      this.data[0] * this.data[0] +
        this.data[1] * this.data[1] +
        this.data[2] * this.data[2]
    );

    if (len > 0.0) {
      this.data[0] /= len;
      this.data[1] /= len;
      this.data[2] /= len;
    }

    return len;
  }

  // Output parameter variants (no allocation)
  static add(a: Vec3, b: Vec3, out: Vec3): Vec3 {
    out.data[0] = a.data[0] + b.data[0];
    out.data[1] = a.data[1] + b.data[1];
    out.data[2] = a.data[2] + b.data[2];
    return out;
  }

  static sub(a: Vec3, b: Vec3, out: Vec3): Vec3 {
    out.data[0] = a.data[0] - b.data[0];
    out.data[1] = a.data[1] - b.data[1];
    out.data[2] = a.data[2] - b.data[2];
    return out;
  }

  static mult(a: Vec3, b: Vec3, out: Vec3): Vec3 {
    out.data[0] = a.data[0] * b.data[0];
    out.data[1] = a.data[1] * b.data[1];
    out.data[2] = a.data[2] * b.data[2];
    return out;
  }

  static cross(a: Vec3, b: Vec3, out: Vec3): Vec3 {
    const ax = a.data[0],
      ay = a.data[1],
      az = a.data[2];
    const bx = b.data[0],
      by = b.data[1],
      bz = b.data[2];

    out.data[0] = ay * bz - az * by;
    out.data[1] = az * bx - ax * bz;
    out.data[2] = ax * by - ay * bx;
    return out;
  }

  static multScalar(a: Vec3, scalar: number, out: Vec3): Vec3 {
    out.data[0] = a.data[0] * scalar;
    out.data[1] = a.data[1] * scalar;
    out.data[2] = a.data[2] * scalar;
    return out;
  }

  static addScalar(a: Vec3, scalar: number, out: Vec3): Vec3 {
    out.data[0] = a.data[0] + scalar;
    out.data[1] = a.data[1] + scalar;
    out.data[2] = a.data[2] + scalar;
    return out;
  }

  // Backwards compatible (allocating versions)
  static addNew(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(
      a.data[0] + b.data[0],
      a.data[1] + b.data[1],
      a.data[2] + b.data[2]
    );
  }

  static subNew(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(
      a.data[0] - b.data[0],
      a.data[1] - b.data[1],
      a.data[2] - b.data[2]
    );
  }

  static multNew(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(
      a.data[0] * b.data[0],
      a.data[1] * b.data[1],
      a.data[2] * b.data[2]
    );
  }

  static crossNew(a: Vec3, b: Vec3): Vec3 {
    const ax = a.data[0],
      ay = a.data[1],
      az = a.data[2];
    const bx = b.data[0],
      by = b.data[1],
      bz = b.data[2];

    return new Vec3(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
  }

  static multScalarNew(a: Vec3, scalar: number): Vec3 {
    return new Vec3(a.data[0] * scalar, a.data[1] * scalar, a.data[2] * scalar);
  }

  static addScalarNew(a: Vec3, scalar: number): Vec3 {
    return new Vec3(a.data[0] + scalar, a.data[1] + scalar, a.data[2] + scalar);
  }

  // Existing methods to maintain
  copy(other: Vec3): this {
    this.data[0] = other.data[0];
    this.data[1] = other.data[1];
    this.data[2] = other.data[2];
    return this;
  }

  clone(): Vec3 {
    return new Vec3(this.data[0], this.data[1], this.data[2]);
  }

  static dot(a: Vec3, b: Vec3): number {
    return (
      a.data[0] * b.data[0] + a.data[1] * b.data[1] + a.data[2] * b.data[2]
    );
  }

  static inverse(a: Vec3): Vec3 {
    const result = new Vec3();
    if (a.data[0] !== 0.0) {
      result.data[0] = 1.0 / a.data[0];
    }
    if (a.data[1] !== 0.0) {
      result.data[1] = 1.0 / a.data[1];
    }
    if (a.data[2] !== 0.0) {
      result.data[2] = 1.0 / a.data[2];
    }
    return result;
  }

  square(): number {
    return (
      this.data[0] * this.data[0] +
      this.data[1] * this.data[1] +
      this.data[2] * this.data[2]
    );
  }

  minIndex(): number {
    const d = this.data;
    return d[0] < d[1] ? (d[0] < d[2] ? 0 : 2) : d[1] < d[2] ? 1 : 2;
  }

  normalize(): number {
    const len = Math.sqrt(
      this.data[0] * this.data[0] +
        this.data[1] * this.data[1] +
        this.data[2] * this.data[2]
    );

    if (len > 0.0) {
      this.data[0] /= len;
      this.data[1] /= len;
      this.data[2] /= len;
    }

    return len;
  }
}
