import { IImage } from "./CV";
import { IPoint } from "./math-types";
interface IDictionaries {
  nBits: number;
  tau: number;
  codeList: number[];
}
interface DictionaryConfig {
  nBits: number;
  tau: number;
  codeList: (number | string | number[])[];
}
export declare class DICTIONARIES {
  static ARUCO: DictionaryConfig;
  static ARUCO_MIP_36h12: DictionaryConfig;
  static getDictionary(name: keyof typeof DICTIONARIES): DictionaryConfig;
}
interface IConfig {
  dictionaryName: IDictionaries;
  maxHammingDistance: number;
}
export declare class Dictionary {
  private codes;
  private codeList;
  tau: number;
  private nBits;
  markSize: number;
  private dicName;
  constructor(dicName: string);
  private initialize;
  private parseCode;
  find(bits: string[][]): {
    id: number;
    distance: number;
  } | null;
  private _hex2bin;
  private _bytes2bin;
  private hammingDistance;
  private calculateTau;
  generateSVG(id: number): string;
}
export declare class Marker {
  private id;
  private corners;
  private hammingDistance;
  constructor(id: number, corners: any, hammingDistance: number);
}
export declare class Detector {
  private config;
  private dictionary;
  private grey;
  private thres;
  private homography;
  private binary;
  private contours;
  private polys;
  private candidates;
  private streamConfig;
  private mjpeg;
  static mjpeg: any;
  constructor(config: IConfig);
  detectImage(width: number, height: number, data: any): Marker[];
  detectStreamInit(width: number, height: number, callback: any): void;
  detectStream(data: any): void;
  detectMJPEGStreamInit(
    width: number,
    height: number,
    callback: any,
    decoderFn: any
  ): void;
  detectMJPEGStream(chunk: any): void;
  detect(image: any): Marker[];
  findCandidates(
    contours: any,
    minSize: number,
    epsilon: number,
    minLength: number
  ): IPoint[][];
  clockwiseCorners(candidates: any): any;
  notTooNear(candidates: any, minDist: number): any[];
  findMarkers(imageSrc: IImage, candidates: any, warpSize: number): Marker[];
  getMarker(imageSrc: IImage, candidate: any): Marker;
  hammingDistance(bits: any): number;
  mat2id(bits: any): number;
  rotate(src: any): any;
  rotate2: (src: any, rotation: any) => any[];
}
export {};
