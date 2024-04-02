export declare class Image {
    private width;
    private height;
    private data;
    constructor(width: number, height: number, data: Uint8ClampedArray);
}
export declare class CV {
    static grayscale(imageSrc: ImageData, imageDst: ImageData): ImageData;
    static threshold(imageSrc: ImageData, imageDst: ImageData, threshold: number): ImageData;
}
