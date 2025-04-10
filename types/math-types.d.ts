export declare class Vec3 {
    v: number[];
    constructor(x?: number, y?: number, z?: number);
    copy(a: Vec3): Vec3;
    static add(a: Vec3, b: Vec3): Vec3;
    static sub(a: Vec3, b: Vec3): Vec3;
    static mult(a: Vec3, b: Vec3): Vec3;
    static addScalar(a: Vec3, b: number): Vec3;
    static multScalar(a: Vec3, b: number): Vec3;
    static dot(a: Vec3, b: Vec3): number;
    static cross(a: Vec3, b: Vec3): Vec3;
    normalize(): number;
    static inverse(a: Vec3): Vec3;
    square(): number;
    minIndex(): number;
}
export declare class Mat3 {
    m: number[][];
    constructor();
    static clone(a: Mat3): Mat3;
    copy(a: Mat3): Mat3;
    static fromRows(a: Vec3, b: Vec3, c: Vec3): Mat3;
    static fromDiagonal(a: Vec3): Mat3;
    static transpose(a: Mat3): Mat3;
    static mult(a: Mat3, b: Mat3): Mat3;
    static multVector(m: Mat3, a: Vec3): Vec3;
    column(index: number): Vec3;
    row(index: number): Vec3;
}
