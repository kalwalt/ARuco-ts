import { IPoint, Vec3, Mat3 } from "./math-types";
export declare class Posit {
    model: Vec3[];
    focalLength: number;
    modelVectors: Mat3;
    modelNormal: Vec3;
    modelPseudoInverse: Mat3;
    constructor(modelSize: number, focalLength: number);
    buildModel(modelSize: number): Vec3[];
    init(): void;
    pose(points: IPoint[]): Pose;
    pos(points: IPoint[], eps: Vec3, rotation1: Mat3, rotation2: Mat3, translation1: Vec3, translation2: Vec3): void;
    iterate(points: IPoint[], rotation: Mat3, translation: Vec3): number;
    getError(points: IPoint[], rotation: Mat3, translation: Vec3): number;
    angle(a: IPoint, b: IPoint, c: IPoint): number;
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
