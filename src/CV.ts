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

class BlurStack {
    public color: number;
    public next: any;
    constructor() {
        this.color = 0;
        this.next = null;
    }
}

export class CV {
    static grayscale(imageSrc: ImageData, imageDst: ImageData): ImageData {
        let src: Uint8ClampedArray = imageSrc.data;
        let dst: Uint8ClampedArray = imageDst.data;
        let len: number = src.length;
        let i: number = 0;
        let j: number = 0;

        for (; i < len; i += 4) {
            dst[j++] =
                (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114 + 0.5) & 0xff;
        }

        imageDst = new ImageData(dst, imageSrc.width, imageSrc.height);

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

        imageDst = new ImageData(dst, imageSrc.width, imageSrc.height);

        return imageDst;
    };

    static adaptiveThreshold(imageSrc: ImageData, imageDst: ImageData, kernelSize: number, threshold: number): ImageData {
        let src = imageSrc.data, dst = imageDst.data, len = src.length, tab = [], i;

        CV.stackBoxBlur(imageSrc, imageDst, kernelSize);

        for (i = 0; i < 768; ++ i){
            tab[i] = (i - 255 <= -threshold)? 255: 0;
        }

        for (i = 0; i < len; ++ i){
            dst[i] = tab[ src[i] - dst[i] + 255 ];
        }

        imageDst = new ImageData(dst, imageSrc.width, imageSrc.height);

        return imageDst;
    };

    static stackBoxBlurMult =
        [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265];

    static stackBoxBlurShift =
        [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13];

    static stackBoxBlur (imageSrc: ImageData, imageDst: ImageData, kernelSize: number){
        let src = imageSrc.data, dst = imageDst.data,
            height = imageSrc.height, width = imageSrc.width,
            heightMinus1 = height - 1, widthMinus1 = width - 1,
            size = kernelSize + kernelSize + 1, radius = kernelSize + 1,
            mult = CV.stackBoxBlurMult[kernelSize],
            shift = CV.stackBoxBlurShift[kernelSize],
            stack, stackStart, color, sum, pos, start, p, x, y, i;

        stack = stackStart = new BlurStack();
        for (i = 1; i < size; ++ i){
            stack = stack.next = new BlurStack();
        }
        stack.next = stackStart;

        pos = 0;

        for (y = 0; y < height; ++ y){
            start = pos;

            color = src[pos];
            sum = radius * color;

            stack = stackStart;
            for (i = 0; i < radius; ++ i){
                stack.color = color;
                stack = stack.next;
            }
            for (i = 1; i < radius; ++ i){
                stack.color = src[pos + i];
                sum += stack.color;
                stack = stack.next;
            }

            stack = stackStart;
            for (x = 0; x < width; ++ x){
                dst[pos ++] = (sum * mult) >>> shift;

                p = x + radius;
                p = start + (p < widthMinus1? p: widthMinus1);
                sum -= stack.color - src[p];

                stack.color = src[p];
                stack = stack.next;
            }
        }

        for (x = 0; x < width; ++ x){
            pos = x;
            start = pos + width;

            color = dst[pos];
            sum = radius * color;

            stack = stackStart;
            for (i = 0; i < radius; ++ i){
                stack.color = color;
                stack = stack.next;
            }
            for (i = 1; i < radius; ++ i){
                stack.color = dst[start];
                sum += stack.color;
                stack = stack.next;

                start += width;
            }

            stack = stackStart;
            for (y = 0; y < height; ++ y){
                dst[pos] = (sum * mult) >>> shift;

                p = y + radius;
                p = x + ( (p < heightMinus1? p: heightMinus1) * width );
                sum -= stack.color - dst[p];

                stack.color = dst[p];
                stack = stack.next;

                pos += width;
            }
        }

        imageDst = new ImageData(dst, imageSrc.width, imageSrc.height);

        return imageDst;
    };
}