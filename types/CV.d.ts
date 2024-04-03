interface IPoint {
    x: number;
    y: number;
}
export declare class Image {
    private width;
    private height;
    private data;
    constructor(width: number, height: number, data: Uint8ClampedArray);
}
export declare class CV {
    static grayscale(imageSrc: ImageData, imageDst: ImageData): ImageData;
    static threshold(imageSrc: ImageData, imageDst: ImageData, threshold: number): ImageData;
    static adaptiveThreshold(imageSrc: ImageData, imageDst: ImageData, kernelSize: number, threshold: number): ImageData;
    static otsu(imageSrc: ImageData): number;
    static stackBoxBlurMult: number[];
    static stackBoxBlurShift: number[];
    static stackBoxBlur(imageSrc: ImageData, imageDst: ImageData, kernelSize: number): ImageData;
    static gaussianBlur(imageSrc: ImageData, imageDst: ImageData, imageMean: ImageData, kernelSize: number): ImageData;
    static gaussianBlurFilter(imageSrc: ImageData, imageDst: ImageData, kernel: any[], horizontal: boolean): ImageData;
    static gaussianKernel(kernelSize: number): number[];
    static findContours(imageSrc: ImageData, binary: any): any[];
    static borderFollowing(src: {
        [x: string]: any;
    }, pos: number, nbd: number, point: {
        x: any;
        y: any;
    }, hole: boolean, deltas: any[]): any;
    static neighborhood: number[][];
    static neighborhoodDeltas(width: number): number[];
    static approxPolyDP(contour: any, epsilon: number): IPoint[];
    static warp(imageSrc: ImageData, imageDst: ImageData, contour: any, warpSize: number): ImageData;
    static getPerspectiveTransform(src: IPoint[], size: number): number[];
    static square2quad(src: IPoint[]): number[];
    static isContourConvex(contour: IPoint[]): boolean;
    static perimeter(poly: IPoint[]): number;
    static minEdgeLength(poly: IPoint[]): number;
    static countNonZero(imageSrc: ImageData, square: any): number;
    static binaryBorder(imageSrc: ImageData, dst: any): any;
}
export {};
