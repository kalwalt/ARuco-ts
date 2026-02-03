import { IPoint } from "./math-types";
export interface IImage {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}
export declare class Image implements IImage {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    constructor(width?: number, height?: number, data?: Uint8ClampedArray | Uint8Array | number[] | ArrayBuffer);
    static fromImageData(imageData: ImageData): Image;
    toImageData(): ImageData;
    clone(): Image;
    fill(value: number): this;
    getPixel(x: number, y: number): number;
    setPixel(x: number, y: number, value: number): void;
    copy(other: Image): this;
}
export declare class CV {
    static grayscale(imageSrc: IImage): Image;
    static threshold(imageSrc: IImage, imageDst: IImage, threshold: number): IImage;
    static adaptiveThreshold(imageSrc: IImage, imageDst: IImage, kernelSize: number, threshold: number): IImage;
    static otsu(imageSrc: IImage): number;
    static stackBoxBlurMult: number[];
    static stackBoxBlurShift: number[];
    static stackBoxBlur(imageSrc: IImage, imageDst: IImage, kernelSize: number): IImage;
    static gaussianBlur(imageSrc: IImage, imageDst: IImage, imageMean: IImage, kernelSize: number): IImage;
    static gaussianBlurFilter(imageSrc: IImage, imageDst: IImage, kernel: any[], horizontal: boolean): IImage;
    static gaussianKernel(kernelSize: number): number[];
    static findContours(imageSrc: IImage, binary: any): number[];
    static borderFollowing(src: {
        [x: string]: any;
    }, pos: number, nbd: number, point: {
        x: any;
        y: any;
    }, hole: boolean, deltas: any[]): any;
    static neighborhood: number[][];
    static neighborhoodDeltas(width: number): number[];
    static approxPolyDP(contour: any, epsilon: number): IPoint[];
    static warp(imageSrc: IImage, imageDst: IImage, contour: IPoint[], warpSize: number): IImage;
    static getPerspectiveTransform(src: IPoint[], size: number): number[];
    static square2quad(src: IPoint[]): number[];
    static isContourConvex(contour: IPoint[]): boolean;
    static perimeter(poly: IPoint[]): number;
    static minEdgeLength(poly: IPoint[]): number;
    static countNonZero(imageSrc: IImage, square: any): number;
    static binaryBorder(imageSrc: IImage, dst: number[]): number[];
}
