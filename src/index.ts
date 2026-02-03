import { Image as _Image } from "./CV";
import { CV as _CV } from "./CV";
import { Detector as _Detector } from "./ARuco";
import { SVD as _SVD } from "./svd";
import { Pose as _Pose } from "./posit";
import { Posit as _Posit } from "./posit";
import { version } from "../package.json";

export const VERSION = version;

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

export namespace SVD {
  export const svdcmp = _SVD.svdcmp;
  export const pythag = _SVD.pythag;
  export const sign = _SVD.sign;
}

export namespace POS {
  export const Pose = _Pose;
  export const Posit = _Posit;
}

// Export optimized math classes
export { Vec3, Mat3 } from "./math";
