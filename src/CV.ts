import { IPoint } from "./math-types";
export interface IImage {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export class Image implements IImage {
  public width: number;
  public height: number;
  public data: Uint8ClampedArray;

  constructor(
    width: number = 0,
    height: number = 0,
    data?: Uint8ClampedArray | Uint8Array | number[] | ArrayBuffer
  ) {
    this.width = width;
    this.height = height;

    if (data instanceof Uint8ClampedArray) {
      // Optimal: zero-copy
      this.data = data;
    } else if (data instanceof Uint8Array) {
      // Convert from Uint8Array
      this.data = new Uint8ClampedArray(data);
    } else if (Array.isArray(data)) {
      // Backwards compatibility: convert from Array
      this.data = new Uint8ClampedArray(data);
    } else if (data instanceof ArrayBuffer) {
      // From raw buffer
      this.data = new Uint8ClampedArray(data);
    } else {
      // Create empty
      this.data = new Uint8ClampedArray(width * height);
    }
  }

  // Canvas integration (zero-copy)
  static fromImageData(imageData: ImageData): Image {
    return new Image(imageData.width, imageData.height, imageData.data);
  }

  toImageData(): ImageData {
    // Create ImageData using the proper constructor
    // TypeScript may have issues with types, so we use a workaround
    const imageData = new ImageData(this.width, this.height);
    imageData.data.set(this.data);
    return imageData;
  }

  // Helper methods
  clone(): Image {
    const img = new Image(this.width, this.height);
    img.data.set(this.data);
    return img;
  }

  fill(value: number): this {
    this.data.fill(value);
    return this;
  }

  getPixel(x: number, y: number): number {
    return this.data[y * this.width + x];
  }

  setPixel(x: number, y: number, value: number): void {
    this.data[y * this.width + x] = value;
  }

  copy(other: Image): this {
    this.width = other.width;
    this.height = other.height;
    this.data = new Uint8ClampedArray(other.data);
    return this;
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
  static grayscale(imageSrc: IImage): Image {
    const src = imageSrc.data;
    const dst = new Image(imageSrc.width, imageSrc.height);
    const dstData = dst.data;

    let i = 0;
    let j = 0;
    const len = src.length;

    // Process RGBA to grayscale
    while (i < len) {
      // Weighted average: 0.299R + 0.587G + 0.114B
      dstData[j++] =
        (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114 + 0.5) | 0;
      i += 4;
    }

    return dst;
  }

  static threshold(
      imageSrc: IImage,
      imageDst: IImage,
      threshold: number
  ): IImage {
    const src = imageSrc.data;
    const dst = imageDst.data;
    const len = src.length;
    const tab = new Uint8Array(256);  // ✅ Usa TypedArray

    for (let i = 0; i < 256; ++i) {
      tab[i] = i <= threshold ? 0 : 255;
    }

    for (let i = 0; i < len; ++i) {
      dst[i] = tab[src[i]];
    }

    imageDst.width = imageSrc.width;
    imageDst.height = imageSrc.height;

    return imageDst;
  }

  static adaptiveThreshold(
      imageSrc: IImage,
      imageDst: IImage,
      kernelSize: number,
      threshold: number
  ): IImage {
    const src = imageSrc.data;
    const dst = imageDst.data;
    const len = src.length;
    const tab = new Uint8Array(768);  // ✅ 768 elementi come originale

    CV.stackBoxBlur(imageSrc, imageDst, kernelSize);

    for (let i = 0; i < 768; ++i) {
      tab[i] = i - 255 <= -threshold ? 255 : 0;
    }

    for (let i = 0; i < len; ++i) {
      dst[i] = tab[src[i] - dst[i] + 255];  // ✅ +255 è CRITICO!
    }

    imageDst.width = imageSrc.width;
    imageDst.height = imageSrc.height;

    return imageDst;
  }

  static otsu(imageSrc: IImage): number {
    const src = imageSrc.data;
    const len = src.length;
    const hist = new Uint32Array(256);
    let threshold = 0;
    let sum = 0;
    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let max = 0;

    for (let i = 0; i < len; ++i) {
      hist[src[i]]++;
    }

    for (let i = 0; i < 256; ++i) {
      sum += hist[i] * i;
    }

    for (let i = 0; i < 256; ++i) {
      wB += hist[i];
      if (0 !== wB) {
        wF = len - wB;
        if (0 === wF) {
          break;
        }

        sumB += hist[i] * i;

        const mu = sumB / wB - (sum - sumB) / wF;
        const between = wB * wF * mu * mu;

        if (between > max) {
          max = between;
          threshold = i;
        }
      }
    }

    return threshold;
  }

  static stackBoxBlurMult = [
    1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265,
  ];

  static stackBoxBlurShift = [
    0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13,
  ];

  static stackBoxBlur(
    imageSrc: IImage,
    imageDst: IImage,
    kernelSize: number
  ): IImage {
    const src = imageSrc.data;
    const dst = imageDst.data;
    const height = imageSrc.height;
    const width = imageSrc.width;
    const heightMinus1 = height - 1;
    const widthMinus1 = width - 1;
    const size = kernelSize + kernelSize + 1;
    const radius = kernelSize + 1;
    const mult = CV.stackBoxBlurMult[kernelSize];
    const shift = CV.stackBoxBlurShift[kernelSize];

    let stack = new BlurStack();
    const stackStart = stack;
    for (let i = 1; i < size; ++i) {
      stack = stack.next = new BlurStack();
    }
    stack.next = stackStart;

    let pos = 0;

    for (let y = 0; y < height; ++y) {
      const start = pos;

      let color = src[pos];
      let sum = radius * color;

      stack = stackStart;
      for (let i = 0; i < radius; ++i) {
        stack.color = color;
        stack = stack.next;
      }
      for (let i = 1; i < radius; ++i) {
        stack.color = src[pos + i];
        sum += stack.color;
        stack = stack.next;
      }

      stack = stackStart;
      for (let x = 0; x < width; ++x) {
        dst[pos++] = (sum * mult) >>> shift;

        let p = x + radius;
        p = start + (p < widthMinus1 ? p : widthMinus1);
        sum -= stack.color - src[p];

        stack.color = src[p];
        stack = stack.next;
      }
    }

    for (let x = 0; x < width; ++x) {
      pos = x;
      let start = pos + width;

      let color = dst[pos];
      let sum = radius * color;

      stack = stackStart;
      for (let i = 0; i < radius; ++i) {
        stack.color = color;
        stack = stack.next;
      }
      for (let i = 1; i < radius; ++i) {
        stack.color = dst[start];
        sum += stack.color;
        stack = stack.next;

        start += width;
      }

      stack = stackStart;
      for (let y = 0; y < height; ++y) {
        dst[pos] = (sum * mult) >>> shift;

        let p = y + radius;
        p = x + (p < heightMinus1 ? p : heightMinus1) * width;
        sum -= stack.color - dst[p];

        stack.color = dst[p];
        stack = stack.next;

        pos += width;
      }
    }

    return imageDst;
  }

  static gaussianBlur(
    imageSrc: IImage,
    imageDst: IImage,
    imageMean: IImage,
    kernelSize: number
  ): IImage {
    var kernel = CV.gaussianKernel(kernelSize);

    imageDst.width = imageSrc.width;
    imageDst.height = imageSrc.height;

    imageMean.width = imageSrc.width;
    imageMean.height = imageSrc.height;

    CV.gaussianBlurFilter(imageSrc, imageMean, kernel, true);
    CV.gaussianBlurFilter(imageMean, imageDst, kernel, false);

    return imageDst;
  }

  static gaussianBlurFilter(
    imageSrc: IImage,
    imageDst: IImage,
    kernel: any[],
    horizontal: boolean
  ): IImage {
    const src = imageSrc.data;
    const dst = imageDst.data;
    const height = imageSrc.height;
    const width = imageSrc.width;
    let pos = 0;
    const limit = kernel.length >> 1;

    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        let value = 0.0;

        for (let k = -limit; k <= limit; ++k) {
          let cur;
          if (horizontal) {
            cur = pos + k;
            if (j + k < 0) {
              cur = pos;
            } else if (j + k >= width) {
              cur = pos;
            }
          } else {
            cur = pos + k * width;
            if (i + k < 0) {
              cur = pos;
            } else if (i + k >= height) {
              cur = pos;
            }
          }

          value += kernel[limit + k] * src[cur];
        }

        dst[pos++] = horizontal ? value : (value + 0.5) | 0;
      }
    }

    return imageDst;
  }

  static gaussianKernel(kernelSize: number): number[] {
    let tab = [
        [1],
        [0.25, 0.5, 0.25],
        [0.0625, 0.25, 0.375, 0.25, 0.0625],
        [0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125],
      ],
      kernel = [],
      center,
      sigma,
      scale2X,
      sum,
      x,
      i;

    if (kernelSize <= 7 && kernelSize % 2 === 1) {
      kernel = tab[kernelSize >> 1];
    } else {
      center = (kernelSize - 1.0) * 0.5;
      sigma = 0.8 + 0.3 * (center - 1.0);
      scale2X = -0.5 / (sigma * sigma);
      sum = 0.0;
      for (i = 0; i < kernelSize; ++i) {
        x = i - center;
        sum += kernel[i] = Math.exp(scale2X * x * x);
      }
      sum = 1 / sum;
      for (i = 0; i < kernelSize; ++i) {
        kernel[i] *= sum;
      }
    }

    return kernel;
  }

  static findContours(imageSrc: IImage, binary: any): number[] {
    let width = imageSrc.width,
      height = imageSrc.height,
      contours = [],
      src,
      deltas,
      pos,
      pix,
      nbd,
      outer,
      hole,
      i,
      j;

    src = CV.binaryBorder(imageSrc, binary);

    deltas = CV.neighborhoodDeltas(width + 2);

    pos = width + 3;
    nbd = 1;

    for (i = 0; i < height; ++i, pos += 2) {
      for (j = 0; j < width; ++j, ++pos) {
        pix = src[pos];

        if (0 !== pix) {
          outer = hole = false;

          if (1 === pix && 0 === src[pos - 1]) {
            outer = true;
          } else if (pix >= 1 && 0 === src[pos + 1]) {
            hole = true;
          }

          if (outer || hole) {
            ++nbd;

            contours.push(
              CV.borderFollowing(src, pos, nbd, { x: j, y: i }, hole, deltas)
            );
          }
        }
      }
    }

    return contours;
  }

  static borderFollowing(
    src: { [x: string]: any },
    pos: number,
    nbd: number,
    point: {
      x: any;
      y: any;
    },
    hole: boolean,
    deltas: any[]
  ) {
    let contour: any = [],
      pos1,
      pos3,
      pos4,
      s,
      s_end;

    contour.hole = hole;

    s = s_end = hole ? 0 : 4;
    do {
      s = (s - 1) & 7;
      pos1 = pos + deltas[s];
      if (src[pos1] !== 0) {
        break;
      }
    } while (s !== s_end);

    if (s === s_end) {
      src[pos] = -nbd;
      contour.push({ x: point.x, y: point.y });
    } else {
      pos3 = pos;

      while (true) {
        s_end = s;

        do {
          pos4 = pos3 + deltas[++s];
        } while (src[pos4] === 0);

        s &= 7;

        if ((s - 1) >>> 0 < s_end >>> 0) {
          src[pos3] = -nbd;
        } else if (src[pos3] === 1) {
          src[pos3] = nbd;
        }

        contour.push({ x: point.x, y: point.y });

        point.x += CV.neighborhood[s][0];
        point.y += CV.neighborhood[s][1];

        if (pos4 === pos && pos3 === pos1) {
          break;
        }

        pos3 = pos4;
        s = (s + 4) & 7;
      }
    }

    return contour;
  }

  static neighborhood: number[][] = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  static neighborhoodDeltas(width: number): number[] {
    let deltas: number[] = [],
      len = CV.neighborhood.length,
      i = 0;

    for (; i < len; ++i) {
      deltas[i] = CV.neighborhood[i][0] + CV.neighborhood[i][1] * width;
    }

    return deltas.concat(deltas);
  }

  static approxPolyDP(contour: any, epsilon: number): IPoint[] {
    let slice = { start_index: 0, end_index: 0 },
      right_slice = { start_index: 0, end_index: 0 },
      poly = [],
      stack = [],
      len = contour.length,
      pt: IPoint,
      start_pt,
      end_pt,
      dist,
      max_dist,
      le_eps,
      dx,
      dy,
      i,
      j,
      k;

    epsilon *= epsilon;

    k = 0;

    for (i = 0; i < 3; ++i) {
      max_dist = 0;

      k = (k + right_slice.start_index) % len;
      start_pt = contour[k];
      if (++k === len) {
        k = 0;
      }

      for (j = 1; j < len; ++j) {
        pt = contour[k];
        if (++k === len) {
          k = 0;
        }

        dx = pt.x - start_pt.x;
        dy = pt.y - start_pt.y;
        dist = dx * dx + dy * dy;

        if (dist > max_dist) {
          max_dist = dist;
          right_slice.start_index = j;
        }
      }
    }

    if (max_dist <= epsilon) {
      poly.push({ x: start_pt.x, y: start_pt.y });
    } else {
      slice.start_index = k;
      slice.end_index = right_slice.start_index += slice.start_index;

      right_slice.start_index -= right_slice.start_index >= len ? len : 0;
      right_slice.end_index = slice.start_index;
      if (right_slice.end_index < right_slice.start_index) {
        right_slice.end_index += len;
      }

      stack.push({
        start_index: right_slice.start_index,
        end_index: right_slice.end_index,
      });
      stack.push({
        start_index: slice.start_index,
        end_index: slice.end_index,
      });
    }

    while (stack.length !== 0) {
      slice = stack.pop();

      end_pt = contour[slice.end_index % len];
      start_pt = contour[(k = slice.start_index % len)];
      if (++k === len) {
        k = 0;
      }

      if (slice.end_index <= slice.start_index + 1) {
        le_eps = true;
      } else {
        max_dist = 0;

        dx = end_pt.x - start_pt.x;
        dy = end_pt.y - start_pt.y;

        for (i = slice.start_index + 1; i < slice.end_index; ++i) {
          pt = contour[k];
          if (++k === len) {
            k = 0;
          }

          dist = Math.abs((pt.y - start_pt.y) * dx - (pt.x - start_pt.x) * dy);

          if (dist > max_dist) {
            max_dist = dist;
            right_slice.start_index = i;
          }
        }

        le_eps = max_dist * max_dist <= epsilon * (dx * dx + dy * dy);
      }

      if (le_eps) {
        poly.push({ x: start_pt.x, y: start_pt.y });
      } else {
        right_slice.end_index = slice.end_index;
        slice.end_index = right_slice.start_index;

        stack.push({
          start_index: right_slice.start_index,
          end_index: right_slice.end_index,
        });
        stack.push({
          start_index: slice.start_index,
          end_index: slice.end_index,
        });
      }
    }

    return poly;
  }

  static warp(
    imageSrc: IImage,
    imageDst: IImage,
    contour: IPoint[],
    warpSize: number
  ): IImage {
    const src = imageSrc.data;
    const width = imageSrc.width;
    const height = imageSrc.height;

    // Ensure dst has enough space
    if (
      imageDst.data.length < warpSize * warpSize ||
      imageDst.width !== warpSize ||
      imageDst.height !== warpSize
    ) {
      imageDst.width = warpSize;
      imageDst.height = warpSize;
      imageDst.data = new Uint8ClampedArray(warpSize * warpSize);
    }

    const dst = imageDst.data;
    let pos = 0;

    const m = CV.getPerspectiveTransform(contour, warpSize - 1);

    let r = m[8];
    let s = m[2];
    let t = m[5];

    for (let i = 0; i < warpSize; ++i) {
      r += m[7];
      s += m[1];
      t += m[4];

      let u = r;
      let v = s;
      let w = t;

      for (let j = 0; j < warpSize; ++j) {
        u += m[6];
        v += m[0];
        w += m[3];

        const x = v / u;
        const y = w / u;

        const sx1 = x >>> 0;
        const sx2 = sx1 === width - 1 ? sx1 : sx1 + 1;
        const dx1 = x - sx1;
        const dx2 = 1.0 - dx1;

        const sy1 = y >>> 0;
        const sy2 = sy1 === height - 1 ? sy1 : sy1 + 1;
        const dy1 = y - sy1;
        const dy2 = 1.0 - dy1;

        const p1 = sy1 * width;
        const p2 = p1;
        const p3 = sy2 * width;
        const p4 = p3;

        dst[pos++] =
          (dy2 * (dx2 * src[p1 + sx1] + dx1 * src[p2 + sx2]) +
            dy1 * (dx2 * src[p3 + sx1] + dx1 * src[p4 + sx2])) |
          0;
      }
    }

    return imageDst;
  }

  static getPerspectiveTransform(src: IPoint[], size: number): number[] {
    let rq = CV.square2quad(src);

    rq[0] /= size;
    rq[1] /= size;
    rq[3] /= size;
    rq[4] /= size;
    rq[6] /= size;
    rq[7] /= size;

    return rq;
  }

  static square2quad(src: IPoint[]): number[] {
    let sq = [],
      px,
      py,
      dx1,
      dx2,
      dy1,
      dy2,
      den;

    px = src[0].x - src[1].x + src[2].x - src[3].x;
    py = src[0].y - src[1].y + src[2].y - src[3].y;

    if (0 === px && 0 === py) {
      sq[0] = src[1].x - src[0].x;
      sq[1] = src[2].x - src[1].x;
      sq[2] = src[0].x;
      sq[3] = src[1].y - src[0].y;
      sq[4] = src[2].y - src[1].y;
      sq[5] = src[0].y;
      sq[6] = 0;
      sq[7] = 0;
      sq[8] = 1;
    } else {
      dx1 = src[1].x - src[2].x;
      dx2 = src[3].x - src[2].x;
      dy1 = src[1].y - src[2].y;
      dy2 = src[3].y - src[2].y;
      den = dx1 * dy2 - dx2 * dy1;

      sq[6] = (px * dy2 - dx2 * py) / den;
      sq[7] = (dx1 * py - px * dy1) / den;
      sq[8] = 1;
      sq[0] = src[1].x - src[0].x + sq[6] * src[1].x;
      sq[1] = src[3].x - src[0].x + sq[7] * src[3].x;
      sq[2] = src[0].x;
      sq[3] = src[1].y - src[0].y + sq[6] * src[1].y;
      sq[4] = src[3].y - src[0].y + sq[7] * src[3].y;
      sq[5] = src[0].y;
    }

    return sq;
  }

  static isContourConvex(contour: IPoint[]): boolean {
    let orientation = 0,
      convex = true,
      len = contour.length,
      i = 0,
      j = 0,
      cur_pt,
      prev_pt,
      dxdy0,
      dydx0,
      dx0,
      dy0,
      dx,
      dy;

    prev_pt = contour[len - 1];
    cur_pt = contour[0];

    dx0 = cur_pt.x - prev_pt.x;
    dy0 = cur_pt.y - prev_pt.y;

    for (; i < len; ++i) {
      if (++j === len) {
        j = 0;
      }

      prev_pt = cur_pt;
      cur_pt = contour[j];

      dx = cur_pt.x - prev_pt.x;
      dy = cur_pt.y - prev_pt.y;
      dxdy0 = dx * dy0;
      dydx0 = dy * dx0;

      orientation |= dydx0 > dxdy0 ? 1 : dydx0 < dxdy0 ? 2 : 3;

      if (3 === orientation) {
        convex = false;
        break;
      }

      dx0 = dx;
      dy0 = dy;
    }

    return convex;
  }

  static perimeter(poly: IPoint[]): number {
    let len = poly.length,
      i = 0,
      j = len - 1,
      p = 0.0,
      dx,
      dy;

    for (; i < len; j = i++) {
      dx = poly[i].x - poly[j].x;
      dy = poly[i].y - poly[j].y;

      p += Math.sqrt(dx * dx + dy * dy);
    }

    return p;
  }

  static minEdgeLength(poly: IPoint[]): number {
    let len = poly.length,
      i = 0,
      j = len - 1,
      min = Infinity,
      d,
      dx,
      dy;

    for (; i < len; j = i++) {
      dx = poly[i].x - poly[j].x;
      dy = poly[i].y - poly[j].y;

      d = dx * dx + dy * dy;

      if (d < min) {
        min = d;
      }
    }

    return Math.sqrt(min);
  }

  static countNonZero(imageSrc: IImage, square: any): number {
    const src = imageSrc.data;
    const height = square.height;
    const width = square.width;
    let pos = square.x + square.y * imageSrc.width;
    const span = imageSrc.width - width;
    let nz = 0;

    for (let i = 0; i < height; ++i) {
      for (let j = 0; j < width; ++j) {
        if (0 !== src[pos++]) {
          ++nz;
        }
      }

      pos += span;
    }

    return nz;
  }

  static binaryBorder(imageSrc: IImage, dst: number[]): number[] {
    const src = imageSrc.data;
    const height = imageSrc.height;
    const width = imageSrc.width;
    let posSrc = 0;
    let posDst = 0;

    for (let j = -2; j < width; ++j) {
      dst[posDst++] = 0;
    }

    for (let i = 0; i < height; ++i) {
      dst[posDst++] = 0;

      for (let j = 0; j < width; ++j) {
        dst[posDst++] = 0 === src[posSrc++] ? 0 : 1;
      }

      dst[posDst++] = 0;
    }

    for (let j = -2; j < width; ++j) {
      dst[posDst++] = 0;
    }

    return dst;
  }
}
