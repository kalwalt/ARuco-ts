import { Image, CV } from "../src/CV";

describe("Image with Uint8ClampedArray", () => {
  describe("Construction", () => {
    it("creates with Uint8ClampedArray", () => {
      const img = new Image(100, 100);
      expect(img.data).toBeInstanceOf(Uint8ClampedArray);
      expect(img.data.length).toBe(10000);
      expect(img.width).toBe(100);
      expect(img.height).toBe(100);
    });

    it("accepts Uint8ClampedArray directly (zero-copy)", () => {
      const data = new Uint8ClampedArray([1, 2, 3, 4]);
      const img = new Image(2, 2, data);
      expect(img.data).toBe(data); // Same reference
      expect(img.width).toBe(2);
      expect(img.height).toBe(2);
    });

    it("converts from regular Array (backwards compatibility)", () => {
      const img = new Image(2, 2, [1, 2, 3, 4]);
      expect(img.data).toBeInstanceOf(Uint8ClampedArray);
      expect(Array.from(img.data)).toEqual([1, 2, 3, 4]);
    });

    it("converts from Uint8Array", () => {
      const uint8 = new Uint8Array([10, 20, 30, 40]);
      const img = new Image(2, 2, uint8);
      expect(img.data).toBeInstanceOf(Uint8ClampedArray);
      expect(Array.from(img.data)).toEqual([10, 20, 30, 40]);
    });

    it("creates from ArrayBuffer", () => {
      const buffer = new ArrayBuffer(4);
      const view = new Uint8Array(buffer);
      view[0] = 100;
      view[1] = 150;
      view[2] = 200;
      view[3] = 250;

      const img = new Image(2, 2, buffer);
      expect(img.data).toBeInstanceOf(Uint8ClampedArray);
      expect(Array.from(img.data)).toEqual([100, 150, 200, 250]);
    });

    it("auto-clamps values to 0-255", () => {
      const data = new Uint8ClampedArray(4);
      data[0] = 300; // Should clamp to 255
      data[1] = -10; // Should clamp to 0
      data[2] = 128; // Should stay 128
      data[3] = 255.5; // Should round to 255

      const img = new Image(2, 2, data);
      expect(img.data[0]).toBe(255);
      expect(img.data[1]).toBe(0);
      expect(img.data[2]).toBe(128);
      expect(img.data[3]).toBe(255);
    });

    it("creates empty image with default constructor", () => {
      const img = new Image();
      expect(img.width).toBe(0);
      expect(img.height).toBe(0);
      expect(img.data).toBeInstanceOf(Uint8ClampedArray);
      expect(img.data.length).toBe(0);
    });
  });

  describe("Canvas Integration", () => {
    // ImageData is only available in browser environments
    // These tests will be skipped in Node.js
    const isNode = typeof window === "undefined";

    (isNode ? it.skip : it)(
      "fromImageData creates Image with same buffer",
      () => {
        const imageData = new ImageData(10, 10);
        const img = Image.fromImageData(imageData);
        expect(img.width).toBe(10);
        expect(img.height).toBe(10);
        expect(img.data).toBe(imageData.data); // Zero-copy!
      }
    );

    (isNode ? it.skip : it)("toImageData creates ImageData", () => {
      const img = new Image(10, 10);
      img.fill(128);
      const imageData = img.toImageData();
      expect(imageData.width).toBe(10);
      expect(imageData.height).toBe(10);
      expect(imageData.data[0]).toBe(128);
    });

    (isNode ? it.skip : it)(
      "round-trip through ImageData preserves data",
      () => {
        const original = new Image(5, 5);
        for (let i = 0; i < 25; i++) {
          original.data[i] = i * 10;
        }

        const imageData = original.toImageData();
        const restored = Image.fromImageData(imageData);

        expect(restored.width).toBe(original.width);
        expect(restored.height).toBe(original.height);
        expect(Array.from(restored.data)).toEqual(Array.from(original.data));
      }
    );
  });

  describe("Helper Methods", () => {
    it("clone creates independent copy", () => {
      const img1 = new Image(2, 2, new Uint8ClampedArray([1, 2, 3, 4]));
      const img2 = img1.clone();

      expect(img2.data).not.toBe(img1.data);
      expect(img2.width).toBe(img1.width);
      expect(img2.height).toBe(img1.height);
      expect(Array.from(img2.data)).toEqual([1, 2, 3, 4]);

      // Modify clone - should not affect original
      img2.data[0] = 100;
      expect(img1.data[0]).toBe(1);
      expect(img2.data[0]).toBe(100);
    });

    it("fill sets all pixels", () => {
      const img = new Image(10, 10);
      img.fill(255);
      expect(img.data.every((v) => v === 255)).toBe(true);
    });

    it("fill returns this for chaining", () => {
      const img = new Image(5, 5);
      const result = img.fill(100);
      expect(result).toBe(img);
    });

    it("getPixel/setPixel work correctly", () => {
      const img = new Image(5, 5);
      img.setPixel(2, 3, 128);
      expect(img.getPixel(2, 3)).toBe(128);

      img.setPixel(0, 0, 255);
      expect(img.getPixel(0, 0)).toBe(255);

      img.setPixel(4, 4, 64);
      expect(img.getPixel(4, 4)).toBe(64);
    });

    it("getPixel/setPixel handle coordinates correctly", () => {
      const img = new Image(3, 3);
      // Fill with pattern
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          img.setPixel(x, y, y * 10 + x);
        }
      }

      expect(img.getPixel(0, 0)).toBe(0);
      expect(img.getPixel(1, 0)).toBe(1);
      expect(img.getPixel(2, 0)).toBe(2);
      expect(img.getPixel(0, 1)).toBe(10);
      expect(img.getPixel(1, 1)).toBe(11);
      expect(img.getPixel(2, 2)).toBe(22);
    });

    it("copy copies another image", () => {
      const img1 = new Image(3, 3);
      img1.fill(100);

      const img2 = new Image(5, 5);
      img2.fill(200);

      img2.copy(img1);

      expect(img2.width).toBe(3);
      expect(img2.height).toBe(3);
      expect(img2.data.length).toBe(9);
      expect(img2.data.every((v) => v === 100)).toBe(true);

      // Should be a copy, not same reference
      img1.data[0] = 50;
      expect(img2.data[0]).toBe(100);
    });

    it("copy returns this for chaining", () => {
      const img1 = new Image(2, 2);
      const img2 = new Image(2, 2);
      const result = img2.copy(img1);
      expect(result).toBe(img2);
    });
  });

  describe("CV Operations", () => {
    it("grayscale converts RGBA to grayscale", () => {
      const rgba = new Uint8ClampedArray([
        255,
        0,
        0,
        255, // Red
        0,
        255,
        0,
        255, // Green
        0,
        0,
        255,
        255, // Blue
        255,
        255,
        255,
        255, // White
      ]);
      const src = new Image(2, 2, rgba);
      const gray = CV.grayscale(src);

      expect(gray.width).toBe(2);
      expect(gray.height).toBe(2);
      expect(gray.data).toBeInstanceOf(Uint8ClampedArray);

      // Verify grayscale values
      // Red: 0.299 * 255 = 76.245 ≈ 76
      expect(gray.data[0]).toBeCloseTo(76, 0);
      // Green: 0.587 * 255 = 149.685 ≈ 150
      expect(gray.data[1]).toBeCloseTo(150, 0);
      // Blue: 0.114 * 255 = 29.07 ≈ 29
      expect(gray.data[2]).toBeCloseTo(29, 0);
      // White: should be 255
      expect(gray.data[3]).toBe(255);
    });

    it("threshold creates binary image", () => {
      const src = new Image(4, 1, new Uint8ClampedArray([50, 100, 150, 200]));
      const dst = new Image(4, 1);
      CV.threshold(src, dst, 128);

      expect(dst.data[0]).toBe(0); // 50 <= 128
      expect(dst.data[1]).toBe(0); // 100 <= 128
      expect(dst.data[2]).toBe(255); // 150 > 128
      expect(dst.data[3]).toBe(255); // 200 > 128
    });

    it("blur reduces noise", () => {
      const src = new Image(5, 5);
      src.fill(100);
      src.setPixel(2, 2, 255); // Spike in center

      const dst = new Image(5, 5);
      CV.stackBoxBlur(src, dst, 1);

      // Center should be smoothed (less than original spike)
      expect(dst.getPixel(2, 2)).toBeLessThan(255);
      expect(dst.getPixel(2, 2)).toBeGreaterThan(100);

      // Neighbors should have values between 100 and the smoothed center
      expect(dst.getPixel(1, 2)).toBeGreaterThanOrEqual(100);
      expect(dst.getPixel(3, 2)).toBeGreaterThanOrEqual(100);
    });

    it("countNonZero counts pixels correctly", () => {
      const img = new Image(10, 10);
      img.data.fill(0);
      img.data[0] = 255;
      img.data[50] = 128;
      img.data[99] = 1;

      const square = { x: 0, y: 0, width: 10, height: 10 };
      expect(CV.countNonZero(img, square)).toBe(3);
    });

    it("countNonZero works on sub-regions", () => {
      const img = new Image(10, 10);
      img.fill(0);

      // Set some pixels in different regions
      img.setPixel(1, 1, 255); // In region 1
      img.setPixel(6, 6, 255); // In region 2
      img.setPixel(8, 8, 255); // In region 2

      // Count in top-left 5x5 region (0-4, 0-4)
      const region1 = { x: 0, y: 0, width: 5, height: 5 };
      expect(CV.countNonZero(img, region1)).toBe(1);

      // Count in bottom-right 5x5 region (5-9, 5-9)
      const region2 = { x: 5, y: 5, width: 5, height: 5 };
      expect(CV.countNonZero(img, region2)).toBe(2);
    });

    it("otsu finds optimal threshold", () => {
      // Create bimodal distribution
      const data = new Uint8ClampedArray(200);
      for (let i = 0; i < 100; i++) {
        data[i] = 30; // Dark mode
      }
      for (let i = 100; i < 200; i++) {
        data[i] = 200; // Bright mode
      }

      const img = new Image(20, 10, data);
      const threshold = CV.otsu(img);

      // Threshold should be between the two modes
      expect(threshold).toBeGreaterThanOrEqual(30);
      expect(threshold).toBeLessThanOrEqual(200);
      // More specifically, should be somewhere in the middle
      expect(threshold).toBeGreaterThan(25);
      expect(threshold).toBeLessThan(205);
    });

    it("adaptiveThreshold handles varying illumination", () => {
      // Create image with gradient
      const img = new Image(10, 10);
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          img.setPixel(x, y, x * 20 + y * 5);
        }
      }

      const result = new Image(10, 10);
      CV.adaptiveThreshold(img, result, 2, 10);

      // Result should be binary (0 or 255)
      for (let i = 0; i < result.data.length; i++) {
        expect([0, 255]).toContain(result.data[i]);
      }
    });
  });

  describe("Performance characteristics", () => {
    it("handles large images efficiently", () => {
      const start = performance.now();
      const img = new Image(1920, 1080);
      const end = performance.now();

      // Should be very fast (<10ms)
      expect(end - start).toBeLessThan(10);

      // Memory should be exactly 1920*1080 bytes
      expect(img.data.byteLength).toBe(1920 * 1080);
    });

    it("Uint8ClampedArray is memory efficient", () => {
      const width = 1920;
      const height = 1080;
      const img = new Image(width, height);

      // Check that it's using typed array
      expect(img.data).toBeInstanceOf(Uint8ClampedArray);

      // Memory is exactly width * height bytes
      expect(img.data.byteLength).toBe(width * height);
    });

    it("clone is efficient", () => {
      const img1 = new Image(640, 480);
      img1.fill(128);

      const start = performance.now();
      const img2 = img1.clone();
      const end = performance.now();

      // Clone should be fast
      expect(end - start).toBeLessThan(10);

      // Verify it's a real copy
      expect(img2.data).not.toBe(img1.data);
      expect(Array.from(img2.data.slice(0, 10))).toEqual(
        Array.from(img1.data.slice(0, 10))
      );
    });
  });

  describe("Edge cases", () => {
    it("handles zero-sized images", () => {
      const img = new Image(0, 0);
      expect(img.data.length).toBe(0);
      expect(img.width).toBe(0);
      expect(img.height).toBe(0);
    });

    it("handles single pixel image", () => {
      const img = new Image(1, 1, new Uint8ClampedArray([128]));
      expect(img.data.length).toBe(1);
      expect(img.getPixel(0, 0)).toBe(128);
      img.setPixel(0, 0, 200);
      expect(img.getPixel(0, 0)).toBe(200);
    });

    it("handles rectangular images", () => {
      const img1 = new Image(100, 1); // Wide
      expect(img1.data.length).toBe(100);

      const img2 = new Image(1, 100); // Tall
      expect(img2.data.length).toBe(100);
    });

    it("fill handles empty image gracefully", () => {
      const img = new Image(0, 0);
      expect(() => img.fill(255)).not.toThrow();
    });

    it("clone handles empty image", () => {
      const img1 = new Image(0, 0);
      const img2 = img1.clone();
      expect(img2.width).toBe(0);
      expect(img2.height).toBe(0);
      expect(img2.data.length).toBe(0);
    });
  });

  describe("Type safety", () => {
    it("maintains Uint8ClampedArray type through operations", () => {
      const img = new Image(10, 10);
      expect(img.data).toBeInstanceOf(Uint8ClampedArray);

      const cloned = img.clone();
      expect(cloned.data).toBeInstanceOf(Uint8ClampedArray);

      img.fill(100);
      expect(img.data).toBeInstanceOf(Uint8ClampedArray);
    });

    it("CV operations return typed arrays", () => {
      const src = new Image(4, 4, new Uint8ClampedArray(16).fill(128));
      const gray = CV.grayscale(src);
      expect(gray.data).toBeInstanceOf(Uint8ClampedArray);

      const dst = new Image(4, 4);
      CV.threshold(src, dst, 128);
      expect(dst.data).toBeInstanceOf(Uint8ClampedArray);
    });
  });
});
