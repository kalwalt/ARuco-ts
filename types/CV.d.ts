export interface IImage {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}
export interface IPoint {
    x: number;
    y: number;
}
export declare class Image implements IImage {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    constructor(width?: number, height?: number, data?: Uint8ClampedArray);
}
export declare class CV {
    static grayscale(imageSrc: IImage, imageDst: IImage): IImage;
    static threshold(imageSrc: IImage, imageDst: IImage, threshold: number): IImage;
    static adaptiveThreshold(imageSrc: IImage, imageDst: IImage, kernelSize: number, threshold: number): IImage;
    static otsu(imageSrc: IImage): number;
    static stackBoxBlurMult: number[];
    static stackBoxBlurShift: number[];
    static stackBoxBlur(imageSrc: IImage, imageDst: IImage, kernelSize: number): IImage;
    static gaussianBlur(imageSrc: ImageData, imageDst: ImageData, imageMean: ImageData, kernelSize: number): ImageData;
    static gaussianBlurFilter(imageSrc: ImageData, imageDst: ImageData, kernel: any[], horizontal: boolean): ImageData;
    static gaussianKernel(kernelSize: number): number[];
    static findContours(imageSrc: IImage, binary: any): any[];
    static borderFollowing(src: {
        [x: string]: any;
    }, pos: number, nbd: number, point: {
        x: any;
        y: any;
    }, hole: boolean, deltas: any[]): any;
    static neighborhood: number[][];
    static neighborhoodDeltas(width: number): number[];
    static approxPolyDP(contour: any, epsilon: number): IPoint[];
    static warp(imageSrc: IImage, imageDst: IImage, contour: any, warpSize: number): IImage;
    static getPerspectiveTransform(src: IPoint[], size: number): number[];
    static square2quad(src: IPoint[]): number[];
    static isContourConvex(contour: IPoint[]): boolean;
    static perimeter(poly: IPoint[]): number;
    static minEdgeLength(poly: IPoint[]): number;
    static countNonZero(imageSrc: IImage, square: any): number;
    static binaryBorder(imageSrc: IImage, dst: any): any;
}
