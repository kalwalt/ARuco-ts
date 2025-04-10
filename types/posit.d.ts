import { Vec3, Mat3 } from './math-types';
interface Point {
    x: number;
    y: number;
}
export declare class Posit {
    model: Vec3[];
    focalLength: number;
    modelVectors: Mat3;
    modelNormal: Vec3;
    modelPseudoInverse: Mat3;
    constructor(modelSize: number, focalLength: number);
    buildModel(modelSize: number): Vec3[];
    init(): void;
    pose(points: Point[]): Pose;
    pos(points: Point[], eps: Vec3, rotation1: Mat3, rotation2: Mat3, translation1: Vec3, translation2: Vec3): void;
    iterate(points: Point[], rotation: Mat3, translation: Vec3): number;
    getError(points: Point[], rotation: Mat3, translation: Vec3): number;
    angle(a: Point, b: Point, c: Point): number;
}
export declare class Pose {
    bestError: number;
    bestRotation: number[][];
    bestTranslation: number[];
    alternativeError: number;
    alternativeRotation: number[][];
    alternativeTranslation: number[];
    constructor(error1: number, rotation1: number[][], translation1: number[], error2: number, rotation2: number[][], translation2: number[]);
}
export {};
