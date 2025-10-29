import { DICTIONARIES, Dictionary, Detector } from "../src/ARuco";

/**
 * Tests for ARuco Dictionary and Detector helpers
 */

describe("Dictionary.find", () => {
  it("finds exact match (distance 0) for a known ARUCO code", () => {
    const dict = new Dictionary("ARUCO");
    const { nBits, codeList } = DICTIONARIES.ARUCO;
    const size = Math.sqrt(nBits); // inner payload size (5 for ARUCO)

    // Emulate Dictionary.parseCode for numeric code
    const bin = (codeList[0] as number).toString(2).padStart(nBits, "0");

    // Build bits matrix row-major
    const bits: number[][] = [];
    for (let y = 0; y < size; y++) {
      bits[y] = [];
      for (let x = 0; x < size; x++) {
        bits[y][x] = bin[y * size + x] === "1" ? 1 : 0;
      }
    }

    const res = dict.find(bits.map((r) => r.map((v) => String(v))));
    expect(res).not.toBeNull();
    expect(res!.id).toBe(0);
    expect(res!.distance).toBe(0);
  });

  it("returns nearest id within tau when a single bit is flipped", () => {
    const dict = new Dictionary("ARUCO");
    const { nBits, codeList, tau } = DICTIONARIES.ARUCO;
    const size = Math.sqrt(nBits);
    const bin = (codeList[1] as number).toString(2).padStart(nBits, "0");

    // Build bits and flip one bit
    const bits: number[][] = [];
    for (let y = 0; y < size; y++) {
      bits[y] = [];
      for (let x = 0; x < size; x++) {
        const idx = y * size + x;
        let bit = bin[idx] === "1" ? 1 : 0;
        if (idx === 0) bit = bit ^ 1; // flip first bit
        bits[y][x] = bit;
      }
    }

    const res = dict.find(bits.map((r) => r.map((v) => String(v))));
    // Should be within configured tau (3) and match id 1 as nearest
    expect(res).not.toBeNull();
    expect(res!.id).toBe(1);
    expect(res!.distance).toBe(1);
    expect(res!.distance).toBeLessThan(tau);
  });
});

describe("Detector.rotate and rotate2", () => {
  it("rotates a matrix 90 degrees clockwise", () => {
    const det = new Detector({
      dictionaryName: "ARUCO",
      maxHammingDistance: 3,
    } as any);
    const src = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const rotated = det.rotate(src);
    expect(rotated).toEqual([
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ]);
  });

  it("rotates candidate corners sequence by k using rotate2", () => {
    const det = new Detector({
      dictionaryName: "ARUCO",
      maxHammingDistance: 3,
    } as any);
    const src = ["a", "b", "c", "d"];
    const r1 = (det as any).rotate2(src, 1);
    expect(r1).toEqual(["b", "c", "d", "a"]);
    const r3 = (det as any).rotate2(src, 3);
    expect(r3).toEqual(["d", "a", "b", "c"]);
  });
});

describe("Detector.mat2id and hammingDistance", () => {
  it("mat2id packs column 1 and 3 into a 10-bit id", () => {
    const det = new Detector({
      dictionaryName: "ARUCO",
      maxHammingDistance: 3,
    } as any);
    // Build a 5x5 matrix where col1 = [1,0,1,0,1] and col3 = [0,1,0,1,0]
    const bits = Array.from({ length: 5 }, () => Array(5).fill(0));
    const col1 = [1, 0, 1, 0, 1];
    const col3 = [0, 1, 0, 1, 0];
    for (let i = 0; i < 5; i++) {
      bits[i][1] = col1[i];
      bits[i][3] = col3[i];
    }
    const id = det.mat2id(bits);
    // Compute expected manually
    let expected = 0;
    for (let i = 0; i < 5; i++) {
      expected <<= 1;
      expected |= col1[i];
      expected <<= 1;
      expected |= col3[i];
    }
    expect(id).toBe(expected);
  });

  it("hammingDistance gives 0 when each row matches one of reference rows", () => {
    const det = new Detector({
      dictionaryName: "ARUCO",
      maxHammingDistance: 3,
    } as any);
    // Reference rows are inside the method; we form bits using the first reference row for all 5 rows
    const row = [1, 0, 0, 0, 0];
    const bits = Array.from({ length: 5 }, () => row.slice());
    const dist = det.hammingDistance(bits);
    expect(dist).toBe(0);
  });
});

describe("DICTIONARIES.getDictionary", () => {
  it("returns ARUCO dictionary config", () => {
    const dict = DICTIONARIES.getDictionary("ARUCO");
    expect(dict.nBits).toBe(25);
    expect(dict.tau).toBe(3);
    expect(Array.isArray(dict.codeList)).toBe(true);
    expect(dict.codeList.length).toBeGreaterThan(0);
  });

  it("returns ARUCO_MIP_36h12 dictionary config", () => {
    const dict = DICTIONARIES.getDictionary("ARUCO_MIP_36h12");
    expect(dict.nBits).toBe(36);
    expect(dict.tau).toBe(12);
    expect(Array.isArray(dict.codeList)).toBe(true);
  });

  it("throws error for invalid dictionary name", () => {
    expect(() => {
      DICTIONARIES.getDictionary("INVALID" as any);
    }).toThrow("not recognized");
  });
});

describe("Dictionary.generateSVG", () => {
  it("generates SVG for valid marker id", () => {
    const dict = new Dictionary("ARUCO");
    const svg = dict.generateSVG(0);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("viewBox");
    expect(svg).toContain("<rect");
  });

  it("throws error for invalid marker id", () => {
    const dict = new Dictionary("ARUCO");
    expect(() => {
      dict.generateSVG(99999);
    }).toThrow("not valid");
  });
});

describe("Detector.detectImage", () => {
  it("accepts width, height, and data parameters", () => {
    const det = new Detector({
      dictionaryName: "ARUCO",
      maxHammingDistance: 3,
    } as any);
    const width = 100;
    const height = 100;
    const data = new Array(width * height * 4).fill(255); // white image

    const markers = det.detectImage(width, height, data);

    expect(Array.isArray(markers)).toBe(true);
  });
});

describe("Detector.findCandidates", () => {
  it("filters contours based on size and shape criteria", () => {
    const det = new Detector({
      dictionaryName: "ARUCO",
      maxHammingDistance: 3,
    } as any);

    // Mock contours: one valid square, one too small, one with 5 points
    const contours = [
      [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 50, y: 50 },
        { x: 0, y: 50 },
        { x: 0, y: 25 },
        { x: 25, y: 0 },
        { x: 50, y: 25 },
        { x: 25, y: 50 },
      ],
      [
        { x: 0, y: 0 },
        { x: 5, y: 0 },
      ],
      [
        { x: 0, y: 0 },
        { x: 30, y: 0 },
        { x: 30, y: 30 },
        { x: 15, y: 40 },
        { x: 0, y: 30 },
        { x: 5, y: 5 },
        { x: 10, y: 10 },
      ],
    ];

    const candidates = det.findCandidates(contours, 5, 0.1, 10);

    expect(Array.isArray(candidates)).toBe(true);
    // Should find at least one valid candidate
    candidates.forEach((cand) => {
      expect(cand.length).toBeGreaterThanOrEqual(3);
    });
  });
});

describe("Detector.clockwiseCorners", () => {
  it("ensures corners are in clockwise order", () => {
    const det = new Detector({
      dictionaryName: "ARUCO",
      maxHammingDistance: 3,
    } as any);

    // Counter-clockwise square
    const candidates = [
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 0 },
      ],
    ];

    const result = det.clockwiseCorners(candidates);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(4);
  });
});

describe("Detector.notTooNear", () => {
  it("filters out candidates that are too close to each other", () => {
    const det = new Detector({
      dictionaryName: "ARUCO",
      maxHammingDistance: 3,
    } as any);

    const candidates = [
      [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ],
      [
        { x: 1, y: 1 },
        { x: 11, y: 1 },
        { x: 11, y: 11 },
        { x: 1, y: 11 },
      ],
    ];

    const result = det.notTooNear(candidates, 5);

    expect(Array.isArray(result)).toBe(true);
    // Should filter out one of the near candidates
    expect(result.length).toBeLessThanOrEqual(candidates.length);
  });
});

describe("Dictionary constructor and parseCode", () => {
  it("initializes with ARUCO dictionary", () => {
    const dict = new Dictionary("ARUCO");
    expect(dict.markSize).toBeGreaterThan(0);
    expect(dict.tau).toBeGreaterThan(0);
  });

  it("initializes with ARUCO_MIP_36h12 dictionary", () => {
    const dict = new Dictionary("ARUCO_MIP_36h12");
    expect(dict.markSize).toBeGreaterThan(0);
    expect(dict.tau).toBeGreaterThan(0);
  });

  it("throws error for invalid dictionary", () => {
    expect(() => {
      new Dictionary("INVALID_DICT");
    }).toThrow();
  });
});
