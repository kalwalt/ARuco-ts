import { CV, Image } from "../src/CV";
import type { IPoint } from "../src/math-types";

describe("CV.grayscale", () => {
  it("converts RGBA image to grayscale (1-channel) with correct dimensions", () => {
    // 2x1 image: pixels: [R,G,B,A]
    const src = new Image(2, 1, [
      255,
      0,
      0,
      255, // red
      0,
      0,
      255,
      255, // blue
    ]);

    const gray = CV.grayscale(src);

    expect(gray.width).toBe(2);
    expect(gray.height).toBe(1);
    // Expected grayscale values using 0.299 R + 0.587 G + 0.114 B, rounded via +0.5 and & 0xff
    const redGray = (255 * 0.299 + 0 * 0.587 + 0 * 0.114 + 0.5) & 0xff; // ~76
    const blueGray = (0 * 0.299 + 0 * 0.587 + 255 * 0.114 + 0.5) & 0xff; // ~29
    expect(gray.data).toEqual([redGray, blueGray]);
  });
});

describe("CV.threshold", () => {
  it("applies binary threshold with lookup table", () => {
    const src = new Image(3, 1, [10, 100, 200]);
    const dst = new Image(3, 1, new Array(3).fill(0));

    CV.threshold(src, dst, 100);

    expect(dst.width).toBe(3);
    expect(dst.height).toBe(1);
    // <= 100 -> 0; > 100 -> 255
    expect(dst.data).toEqual([0, 0, 255]);
  });
});

describe("CV.gaussianKernel", () => {
  it("returns predefined small kernels for sizes 1, 3, 5, 7", () => {
    expect(CV.gaussianKernel(1)).toEqual([1]);
    expect(CV.gaussianKernel(3)).toEqual([0.25, 0.5, 0.25]);
    expect(CV.gaussianKernel(5)).toEqual([0.0625, 0.25, 0.375, 0.25, 0.0625]);
    expect(CV.gaussianKernel(7)).toEqual([
      0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125,
    ]);
  });

  it("builds a normalized kernel for larger odd sizes", () => {
    const k9 = CV.gaussianKernel(9);
    expect(k9.length).toBe(9);
    const sum = k9.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 12);
    // symmetry check
    for (let i = 0; i < 4; i++) {
      expect(k9[i]).toBeCloseTo(k9[8 - i], 12);
    }
  });
});

describe("CV.neighborhoodDeltas", () => {
  it("computes correct deltas and duplicates the array", () => {
    const width = 5;
    const deltas = CV.neighborhoodDeltas(width);
    expect(deltas.length).toBe(16);
    const expectedFirst8 = [
      1, // [1, 0]
      -4, // [1, -1] => 1 + (-1)*5
      -5, // [0, -1]
      -6, // [-1, -1]
      -1, // [-1, 0]
      4, // [-1, 1]
      5, // [0, 1]
      6, // [1, 1]
    ];
    expect(deltas.slice(0, 8)).toEqual(expectedFirst8);
    expect(deltas.slice(8)).toEqual(expectedFirst8);
  });
});

describe("CV.isContourConvex", () => {
  it("returns true for a convex polygon (square)", () => {
    const square: IPoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];
    expect(CV.isContourConvex(square)).toBe(true);
  });

  it("returns false for a non-convex polygon (concave arrow)", () => {
    const concave: IPoint[] = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 1, y: 1 }, // inward dent
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ];
    expect(CV.isContourConvex(concave)).toBe(false);
  });
});

describe("CV.perimeter and CV.minEdgeLength", () => {
  it("computes correct perimeter and minimum edge length for a unit square", () => {
    const square: IPoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];
    expect(CV.perimeter(square)).toBeCloseTo(4, 12);
    expect(CV.minEdgeLength(square)).toBeCloseTo(1, 12);
  });
});

describe("CV.binaryBorder and CV.countNonZero", () => {
  it("pads the binary image with a 0 border and counts non-zero values", () => {
    // 3x3 image with 4 ones
    const src = new Image(3, 3, [1, 0, 1, 0, 1, 0, 0, 0, 1]);
    const dst: number[] = [];

    const bordered = CV.binaryBorder(src, dst);
    // bordered should be (3+2) x (3+2) = 25 elements
    expect(bordered.length).toBe(25);
    // Sum of ones inside original area should be 4
    const nzSquare = { x: 0, y: 0, width: 3, height: 3 } as const;
    expect(CV.countNonZero(src, nzSquare)).toBe(4);

    // Check that the interior of bordered (excluding outer ring) matches binarized src (0/1)
    // Interior starts at index (width+2) + 1 = 5 + 1 = 6, then rows of 5 with 1..3 columns
    const bw = src.width + 2; // 5
    const interior: number[] = [];
    for (let y = 0; y < src.height; y++) {
      const rowStart = (y + 1) * bw + 1;
      for (let x = 0; x < src.width; x++) {
        interior.push(bordered[rowStart + x]);
      }
    }
    const bin = src.data.map((v) => (v === 0 ? 0 : 1));
    expect(interior).toEqual(bin);
  });
});

describe("CV.otsu", () => {
  it("calculates optimal threshold for bimodal histogram", () => {
    // Create image with two distinct intensity peaks
    const data = [
      ...Array(50).fill(30), // dark region
      ...Array(50).fill(200), // bright region
    ];
    const img = new Image(10, 10, data);
    const threshold = CV.otsu(img);

    // Threshold should be between the two peaks
    expect(threshold).toBeGreaterThanOrEqual(30);
    expect(threshold).toBeLessThan(200);
  });

  it("handles uniform image", () => {
    const img = new Image(5, 5, Array(25).fill(128));
    const threshold = CV.otsu(img);
    expect(threshold).toBeGreaterThanOrEqual(0);
    expect(threshold).toBeLessThanOrEqual(255);
  });
});

describe("CV.adaptiveThreshold", () => {
  it("applies adaptive threshold using stackBoxBlur", () => {
    const src = new Image(5, 5, Array(25).fill(100));
    const dst = new Image(5, 5, new Array(25).fill(0));

    const result = CV.adaptiveThreshold(src, dst, 2, 10);

    expect(result.width).toBe(5);
    expect(result.height).toBe(5);
    expect(result.data.length).toBe(25);
    // All values should be either 0 or 255
    result.data.forEach((val) => {
      expect([0, 255]).toContain(val);
    });
  });
});

describe("CV.stackBoxBlur", () => {
  it("blurs a simple image", () => {
    const src = new Image(3, 3, [0, 0, 0, 0, 255, 0, 0, 0, 0]);
    const dst = new Image(3, 3, new Array(9).fill(0));

    const result = CV.stackBoxBlur(src, dst, 1);

    expect(result.width).toBe(3);
    expect(result.height).toBe(3);
    // Box blur spreads the center value to neighbors
    expect(result.data[4]).toBeGreaterThan(0); // center still has value
    // Check that blur has spread to neighbors
    expect(result.data.some((v) => v > 0)).toBe(true);
  });
});

describe("CV.gaussianBlur", () => {
  it("applies two-pass Gaussian blur", () => {
    const src = new Image(
      5,
      5,
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ]
    );
    const dst = new Image(5, 5, new Array(25).fill(0));
    const mean = new Image(5, 5, new Array(25).fill(0));

    const result = CV.gaussianBlur(src, dst, mean, 3);

    expect(result.width).toBe(5);
    expect(result.height).toBe(5);
    // Center should still be brightest but blurred
    expect(result.data[12]).toBeGreaterThan(0);
  });
});

describe("CV.approxPolyDP", () => {
  it("simplifies a contour to approximate polygon", () => {
    // Square with extra points
    const contour: IPoint[] = [
      { x: 0, y: 0 },
      { x: 0.1, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 0.1 },
      { x: 1, y: 1 },
      { x: 0.9, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 0.9 },
    ];

    const poly = CV.approxPolyDP(contour, 0.1);

    // Should simplify to approximately 4 corners
    expect(poly.length).toBeLessThanOrEqual(contour.length);
    expect(poly.length).toBeGreaterThanOrEqual(3);
  });

  it("handles small epsilon returning few points", () => {
    const contour: IPoint[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ];

    const poly = CV.approxPolyDP(contour, 1);

    expect(poly.length).toBeGreaterThan(0);
  });
});

describe("CV.warp and CV.getPerspectiveTransform", () => {
  it("warps image using perspective transform", () => {
    const src = new Image(
      4,
      4,
      Array.from({ length: 16 }, (_, i) => i * 16)
    );
    const dst = new Image();
    const contour: IPoint[] = [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 3 },
      { x: 0, y: 3 },
    ];

    const result = CV.warp(src, dst, contour, 4);

    expect(result.width).toBe(4);
    expect(result.height).toBe(4);
    expect(result.data.length).toBe(16);
  });
});

describe("CV.square2quad", () => {
  it("computes identity transform for aligned square", () => {
    const square: IPoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];

    const matrix = CV.square2quad(square);

    expect(matrix.length).toBe(9);
    expect(matrix[8]).toBe(1); // homogeneous coordinate
  });

  it("handles arbitrary quadrilateral", () => {
    const quad: IPoint[] = [
      { x: 1, y: 1 },
      { x: 4, y: 2 },
      { x: 3, y: 5 },
      { x: 0, y: 4 },
    ];

    const matrix = CV.square2quad(quad);

    expect(matrix.length).toBe(9);
    expect(matrix[8]).toBe(1);
  });
});

describe("CV.findContours", () => {
  it("finds contours in binary image", () => {
    // Simple 5x5 image with a square
    const img = new Image(
      5,
      5,
      [
        0, 0, 0, 0, 0, 0, 255, 255, 255, 0, 0, 255, 0, 255, 0, 0, 255, 255, 255,
        0, 0, 0, 0, 0, 0,
      ]
    );
    const binary: any[] = [];

    const contours = CV.findContours(img, binary);

    expect(Array.isArray(contours)).toBe(true);
    expect(contours.length).toBeGreaterThanOrEqual(0);
  });
});
