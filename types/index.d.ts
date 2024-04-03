import { Image as _Image } from './CV';
import { CV as _CV } from './CV';
import { Detector as _Detector } from './ARuco';
export declare namespace CV {
    const Image: typeof _Image;
    const grayscale: typeof _CV.grayscale;
    const threshold: typeof _CV.threshold;
    const adaptiveThreshold: typeof _CV.adaptiveThreshold;
    const otsu: typeof _CV.otsu;
    const stackBoxBlur: typeof _CV.stackBoxBlur;
    const gaussianBlur: typeof _CV.gaussianBlur;
    const findContours: typeof _CV.findContours;
    const approxPolyDP: typeof _CV.approxPolyDP;
    const warp: typeof _CV.warp;
    const getPerspectiveTransform: typeof _CV.getPerspectiveTransform;
    const isContourConvex: typeof _CV.isContourConvex;
    const perimeter: typeof _CV.perimeter;
    const minEdgeLength: typeof _CV.minEdgeLength;
    const countNonZero: typeof _CV.countNonZero;
}
export declare namespace ARuco {
    const Detector: typeof _Detector;
}
