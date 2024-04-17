import { IImage, IPoint } from './CV';
export declare class Marker {
    private id;
    private corners;
    constructor(id: number, corners: any);
}
export declare class Detector {
    private grey;
    private thres;
    private homography;
    private binary;
    private contours;
    private polys;
    private candidates;
    constructor();
    detect(image: any): Marker[];
    findCandidates(contours: any, minSize: number, epsilon: number, minLength: number): IPoint[][];
    clockwiseCorners(candidates: any): any;
    notTooNear(candidates: any, minDist: number): any[];
    findMarkers(imageSrc: IImage, candidates: any, warpSize: number): Marker[];
    getMarker(imageSrc: IImage, candidate: any): Marker;
    hammingDistance(bits: any): number;
    mat2id(bits: any): number;
    rotate(src: any): any;
    rotate2: (src: any, rotation: any) => any[];
}
