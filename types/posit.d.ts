import { Vec3 } from './math-types';
export declare class Posit {
    model: any;
    focalLength: any;
    modelVectors: any;
    modelNormal: any;
    modelPseudoInverse: any;
    constructor(modelSize: any, focalLength: any);
    buildModel(modelSize: any): Vec3[];
    init(): void;
    pose(points: any): Pose;
    pos(points: any, eps: any, rotation1: any, rotation2: any, translation1: any, translation2: any): void;
    iterate(points: any, rotation: any, translation: any): number;
    getError(points: any, rotation: any, translation: any): number;
    angle(a: any, b: any, c: any): number;
}
export declare class Pose {
    bestError: any;
    bestRotation: any;
    bestTranslation: any;
    alternativeError: any;
    alternativeRotation: any;
    alternativeTranslation: any;
    constructor(error1: any, rotation1: any, translation1: any, error2: any, rotation2: any, translation2: any);
}
