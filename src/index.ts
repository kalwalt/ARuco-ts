import {Image as _Image} from './CV'
import { CV as _CV } from './CV'
import { Detector as _Detector } from './ARuco'

export namespace CV {
    export const Image = _Image;
    export const grayscale = _CV.grayscale;
    export const threshold = _CV.threshold;
    export const adaptiveThreshold = _CV.adaptiveThreshold;
    export const otsu = _CV.otsu;
    export const stackBoxBlur = _CV.stackBoxBlur;
    export const gaussianBlur = _CV.gaussianBlur;
    export const findContours = _CV.findContours;
    export const approxPolyDP = _CV.approxPolyDP;
    export const warp = _CV.warp;
    export const getPerspectiveTransform = _CV.getPerspectiveTransform;
    export const isContourConvex = _CV.isContourConvex;
    export const perimeter = _CV.perimeter;
    export const minEdgeLength = _CV.minEdgeLength;
    export const countNonZero = _CV.countNonZero;
}

export namespace ARuco {
export const Detector = _Detector;
}