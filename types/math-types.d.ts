export declare class Vec3 {
    v: number[];
    constructor(x?: number, y?: number, z?: number);
    copy(a: any): Vec3;
    static add(a: any, b: any): Vec3;
    static sub(a: any, b: any): Vec3;
    static mult(a: any, b: any): Vec3;
    static addScalar(a: any, b: number): Vec3;
    static multScalar(a: any, b: number): Vec3;
    static dot(a: any, b: any): number;
    static cross(a: any, b: any): Vec3;
    normalize(): number;
    static inverse(a: any): Vec3;
    square(): number;
    minIndex(): number;
}
export declare class Mat3 {
    m: number[][];
    constructor();
    static clone(a: any): Mat3;
    copy(a: any): Mat3;
    static fromRows(a: any, b: any, c: any): Mat3;
    static fromDiagonal(a: any): Mat3;
    static transpose(a: any): Mat3;
    static mult(a: any, b: any): Mat3;
    static multVector(m: any, a: any): Vec3;
    column(index: number): Vec3;
    row(index: number): Vec3;
}
