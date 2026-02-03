// Interface for 2D points
export interface IPoint {
  x: number;
  y: number;
}

export class Vec3 {
  public v: number[];

  constructor(x?: number, y?: number, z?: number) {
    this.v = [x || 0.0, y || 0.0, z || 0.0];
  }

  copy(a: Vec3): Vec3 {
    let v = this.v;
    const aVector = a.v;

    v[0] = aVector[0];
    v[1] = aVector[1];
    v[2] = aVector[2];

    return this;
  }

  static add(a: Vec3, b: Vec3): Vec3 {
    const vector = new Vec3(),
      v = vector.v;
    const aVector = a.v;
    const bVector = b.v;

    v[0] = aVector[0] + bVector[0];
    v[1] = aVector[1] + bVector[1];
    v[2] = aVector[2] + bVector[2];

    return vector;
  }

  static sub(a: Vec3, b: Vec3): Vec3 {
    const vector = new Vec3(),
      v = vector.v;
    const aVector = a.v;
    const bVector = b.v;

    v[0] = aVector[0] - bVector[0];
    v[1] = aVector[1] - bVector[1];
    v[2] = aVector[2] - bVector[2];

    return vector;
  }

  static mult(a: Vec3, b: Vec3): Vec3 {
    const vector = new Vec3(),
      v = vector.v;
    const aVector = a.v;
    const bVector = b.v;

    v[0] = aVector[0] * bVector[0];
    v[1] = aVector[1] * bVector[1];
    v[2] = aVector[2] * bVector[2];

    return vector;
  }

  static addScalar(a: Vec3, b: number): Vec3 {
    const vector = new Vec3(),
      v = vector.v;
    const aVector = a.v;

    v[0] = aVector[0] + b;
    v[1] = aVector[1] + b;
    v[2] = aVector[2] + b;

    return vector;
  }

  static multScalar(a: Vec3, b: number): Vec3 {
    const vector = new Vec3(),
      v = vector.v;
    const aVector = a.v;

    v[0] = aVector[0] * b;
    v[1] = aVector[1] * b;
    v[2] = aVector[2] * b;

    return vector;
  }

  static dot(a: Vec3, b: Vec3): number {
    const aVector = a.v;
    const bVector = b.v;

    return (
      aVector[0] * bVector[0] +
      aVector[1] * bVector[1] +
      aVector[2] * bVector[2]
    );
  }

  static cross(a: Vec3, b: Vec3): Vec3 {
    const aVector = a.v;
    const bVector = b.v;

    return new Vec3(
      aVector[1] * bVector[2] - aVector[2] * bVector[1],
      aVector[2] * bVector[0] - aVector[0] * bVector[2],
      aVector[0] * bVector[1] - aVector[1] * bVector[0],
    );
  }

  normalize(): number {
    const v = this.v,
      len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

    if (len > 0.0) {
      v[0] /= len;
      v[1] /= len;
      v[2] /= len;
    }

    return len;
  }

  static inverse(a: Vec3): Vec3 {
    const vector = new Vec3(),
      v = vector.v;
    const aVector = a.v;

    if (aVector[0] !== 0.0) {
      v[0] = 1.0 / aVector[0];
    }
    if (aVector[1] !== 0.0) {
      v[1] = 1.0 / aVector[1];
    }
    if (aVector[2] !== 0.0) {
      v[2] = 1.0 / aVector[2];
    }

    return vector;
  }

  square(): number {
    const v = this.v;

    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
  }

  minIndex(): number {
    const v = this.v;

    return v[0] < v[1] ? (v[0] < v[2] ? 0 : 2) : v[1] < v[2] ? 1 : 2;
  }
}

export class Mat3 {
  public m: number[][];

  constructor() {
    this.m = [
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0],
    ];
  }

  static clone(a: Mat3): Mat3 {
    const matrix = new Mat3();
    const m = matrix.m;
    const aMatrix = a.m;

    m[0][0] = aMatrix[0][0];
    m[0][1] = aMatrix[0][1];
    m[0][2] = aMatrix[0][2];
    m[1][0] = aMatrix[1][0];
    m[1][1] = aMatrix[1][1];
    m[1][2] = aMatrix[1][2];
    m[2][0] = aMatrix[2][0];
    m[2][1] = aMatrix[2][1];
    m[2][2] = aMatrix[2][2];

    return matrix;
  }

  copy(a: Mat3): Mat3 {
    const m = this.m;
    const aMatrix = a.m;

    m[0][0] = aMatrix[0][0];
    m[0][1] = aMatrix[0][1];
    m[0][2] = aMatrix[0][2];
    m[1][0] = aMatrix[1][0];
    m[1][1] = aMatrix[1][1];
    m[1][2] = aMatrix[1][2];
    m[2][0] = aMatrix[2][0];
    m[2][1] = aMatrix[2][1];
    m[2][2] = aMatrix[2][2];

    return this;
  }

  static fromRows(a: Vec3, b: Vec3, c: Vec3): Mat3 {
    const matrix = new Mat3();
    const m = matrix.m;

    const aVector = a.v;
    const bVector = b.v;
    const cVector = c.v;

    m[0][0] = aVector[0];
    m[0][1] = aVector[1];
    m[0][2] = aVector[2];
    m[1][0] = bVector[0];
    m[1][1] = bVector[1];
    m[1][2] = bVector[2];
    m[2][0] = cVector[0];
    m[2][1] = cVector[1];
    m[2][2] = cVector[2];

    return matrix;
  }

  static fromDiagonal(a: Vec3): Mat3 {
    const matrix = new Mat3();
    const m = matrix.m;
    const aVector = a.v;

    m[0][0] = aVector[0];
    m[1][1] = aVector[1];
    m[2][2] = aVector[2];

    return matrix;
  }

  static transpose(a: Mat3): Mat3 {
    const matrix = new Mat3();
    const m = matrix.m;
    const aMatrix = a.m;

    m[0][0] = aMatrix[0][0];
    m[0][1] = aMatrix[1][0];
    m[0][2] = aMatrix[2][0];
    m[1][0] = aMatrix[0][1];
    m[1][1] = aMatrix[1][1];
    m[1][2] = aMatrix[2][1];
    m[2][0] = aMatrix[0][2];
    m[2][1] = aMatrix[1][2];
    m[2][2] = aMatrix[2][2];

    return matrix;
  }

  static mult(a: Mat3, b: Mat3): Mat3 {
    const matrix = new Mat3();
    const m = matrix.m;
    const aMatrix = a.m;
    const bMatrix = b.m;

    m[0][0] =
      aMatrix[0][0] * bMatrix[0][0] +
      aMatrix[0][1] * bMatrix[1][0] +
      aMatrix[0][2] * bMatrix[2][0];
    m[0][1] =
      aMatrix[0][0] * bMatrix[0][1] +
      aMatrix[0][1] * bMatrix[1][1] +
      aMatrix[0][2] * bMatrix[2][1];
    m[0][2] =
      aMatrix[0][0] * bMatrix[0][2] +
      aMatrix[0][1] * bMatrix[1][2] +
      aMatrix[0][2] * bMatrix[2][2];
    m[1][0] =
      aMatrix[1][0] * bMatrix[0][0] +
      aMatrix[1][1] * bMatrix[1][0] +
      aMatrix[1][2] * bMatrix[2][0];
    m[1][1] =
      aMatrix[1][0] * bMatrix[0][1] +
      aMatrix[1][1] * bMatrix[1][1] +
      aMatrix[1][2] * bMatrix[2][1];
    m[1][2] =
      aMatrix[1][0] * bMatrix[0][2] +
      aMatrix[1][1] * bMatrix[1][2] +
      aMatrix[1][2] * bMatrix[2][2];
    m[2][0] =
      aMatrix[2][0] * bMatrix[0][0] +
      aMatrix[2][1] * bMatrix[1][0] +
      aMatrix[2][2] * bMatrix[2][0];
    m[2][1] =
      aMatrix[2][0] * bMatrix[0][1] +
      aMatrix[2][1] * bMatrix[1][1] +
      aMatrix[2][2] * bMatrix[2][1];
    m[2][2] =
      aMatrix[2][0] * bMatrix[0][2] +
      aMatrix[2][1] * bMatrix[1][2] +
      aMatrix[2][2] * bMatrix[2][2];

    return matrix;
  }

  static multVector(m: Mat3, a: Vec3): Vec3 {
    const mMatrix = m.m;
    const aVector = a.v;

    return new Vec3(
      mMatrix[0][0] * aVector[0] +
        mMatrix[0][1] * aVector[1] +
        mMatrix[0][2] * aVector[2],
      mMatrix[1][0] * aVector[0] +
        mMatrix[1][1] * aVector[1] +
        mMatrix[1][2] * aVector[2],
      mMatrix[2][0] * aVector[0] +
        mMatrix[2][1] * aVector[1] +
        mMatrix[2][2] * aVector[2],
    );
  }

  column(index: number): Vec3 {
    const m = this.m;

    return new Vec3(m[0][index], m[1][index], m[2][index]);
  }

  row(index: number): Vec3 {
    const m = this.m;

    return new Vec3(m[index][0], m[index][1], m[index][2]);
  }
}
