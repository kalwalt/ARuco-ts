export class Image {
    private width: number;
    private height: number;
    private data: Uint8ClampedArray;
    constructor(width: number, height: number, data: Uint8ClampedArray) {
        this.width = width;
        this.height = height;
        this.data = data;
    }
}


export class CV {
    static grayscale(imageSrc: ImageData, imageDst: ImageData): ImageData {
        let src: Uint8ClampedArray = imageSrc.data;
        let dst: Uint8ClampedArray = imageDst.data;
        console.log(dst)
        let len: number = src.length;
        let i: number = 0;
        let j: number = 0;

        for (; i < len; i += 4) {
            dst[j++] =
                (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114 + 0.5) & 0xff;
        }

        var imageData: ImageData = new ImageData(dst, imageSrc.width, imageSrc.height)

        imageDst = imageData;

        return imageDst;

    };

    static threshold (imageSrc: ImageData, imageDst: ImageData, threshold: number): ImageData{
        let src = imageSrc.data, dst = imageDst.data,
            len = src.length, tab = [], i;

        for (i = 0; i < 256; ++ i){
            tab[i] = i <= threshold? 0: 255;
        }

        for (i = 0; i < len; ++ i){
            dst[i] = tab[ src[i] ];
        }

        var imageData: ImageData = new ImageData(dst, imageSrc.width, imageSrc.height)

        imageDst = imageData;

        return imageDst;
    };
}