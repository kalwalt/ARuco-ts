import { Image, CV } from "../src/CV";

function generateRealisticImageData(
  width: number,
  height: number,
  type: "rgba" | "grayscale" = "rgba"
): Uint8ClampedArray {
  const size = type === "rgba" ? width * height * 4 : width * height;
  const data = new Uint8ClampedArray(size);

  for (let i = 0; i < data.length; i++) {
    if (type === "rgba") {
      const channel = i % 4;
      if (channel === 3) {
        data[i] = 255; // Alpha
      } else {
        const pixelIndex = Math.floor(i / 4);
        const x = (pixelIndex % width) / width;
        const y = Math.floor(pixelIndex / width) / height;
        const gradient = Math.floor((x + y) * 127);
        const noise = Math.floor(Math.random() * 40 - 20);
        data[i] = Math.max(0, Math.min(255, gradient + noise));
      }
    } else {
      const x = (i % width) / width;
      const y = Math.floor(i / width) / height;
      data[i] = Math.floor((x + y) * 127 + Math.random() * 40);
    }
  }

  return data;
}

function benchmark(
  name: string,
  fn: () => void,
  iterations = 100
): number {
  // Warm-up
  for (let i = 0; i < 5; i++) fn();

  // Force GC if available
  if ((global as any).gc) (global as any).gc();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();

  const time = end - start;
  console.log(
    `${name}: ${time.toFixed(2)}ms (${iterations} iterations)`
  );
  console.log(
    `  Average: ${(time / iterations).toFixed(3)}ms per iteration\n`
  );

  return time;
}

console.log("=== Image Performance Benchmarks ===\n");
console.log("Resolution: 1920×1080 (Full HD)\n");

const WIDTH = 1920;
const HEIGHT = 1080;

// Test 1: Memory Footprint
console.log("--- Test 1: Memory Usage ---\n");
if ((global as any).gc) (global as any).gc();
const memBefore = process.memoryUsage().heapUsed;
const img = new Image(
  WIDTH,
  HEIGHT,
  generateRealisticImageData(WIDTH, HEIGHT, "grayscale")
);
const memAfter = process.memoryUsage().heapUsed;
console.log(
  `Image (1920×1080): ${((memAfter - memBefore) / 1024 / 1024).toFixed(2)} MB`
);
console.log(`Expected: ~2.07 MB (1920*1080 bytes)`);
console.log(
  `Actual data size: ${(img.data.byteLength / 1024 / 1024).toFixed(2)} MB\n`
);

// Test 2: Grayscale
console.log("--- Test 2: Grayscale Conversion ---\n");
const rgbaData = generateRealisticImageData(WIDTH, HEIGHT, "rgba");
const srcRgba = new Image(WIDTH, HEIGHT, rgbaData);

const grayTime = benchmark(
  "Grayscale",
  () => {
    CV.grayscale(srcRgba);
  },
  100
);

// Test 3: Threshold
console.log("--- Test 3: Binary Threshold ---\n");
const grayData = generateRealisticImageData(WIDTH, HEIGHT, "grayscale");
const srcGray = new Image(WIDTH, HEIGHT, grayData);
const dstThresh = new Image(WIDTH, HEIGHT);

const threshTime = benchmark(
  "Threshold",
  () => {
    CV.threshold(srcGray, dstThresh, 128);
  },
  100
);

// Test 4: Blur
console.log("--- Test 4: Box Blur ---\n");
const dstBlur = new Image(WIDTH, HEIGHT);

const blurTime = benchmark(
  "Box Blur (kernel=3)",
  () => {
    CV.stackBoxBlur(srcGray, dstBlur, 3);
  },
  20
);

// Test 5: Complete Pipeline
console.log("--- Test 5: Full Pipeline ---\n");
console.log("(Grayscale → Blur → Threshold)\n");

const pipelineTime = benchmark(
  "Complete Pipeline",
  () => {
    const gray = CV.grayscale(srcRgba);
    const blurred = new Image(gray.width, gray.height);
    CV.stackBoxBlur(gray, blurred, 2);
    const thresh = new Image(blurred.width, blurred.height);
    CV.threshold(blurred, thresh, 128);
  },
  50
);

// Test 6: Image Operations
console.log("--- Test 6: Image Operations ---\n");

const cloneTime = benchmark(
  "Clone",
  () => {
    srcGray.clone();
  },
  1000
);

const fillTime = benchmark(
  "Fill",
  () => {
    const tmp = new Image(WIDTH, HEIGHT);
    tmp.fill(128);
  },
  1000
);

// Test 7: Pixel Access
console.log("--- Test 7: Pixel Access ---\n");

const getPixelTime = benchmark(
  "Get Pixel (1000 random reads)",
  () => {
    for (let i = 0; i < 1000; i++) {
      const x = Math.floor(Math.random() * WIDTH);
      const y = Math.floor(Math.random() * HEIGHT);
      srcGray.getPixel(x, y);
    }
  },
  100
);

const setPixelTime = benchmark(
  "Set Pixel (1000 random writes)",
  () => {
    const tmp = new Image(WIDTH, HEIGHT);
    for (let i = 0; i < 1000; i++) {
      const x = Math.floor(Math.random() * WIDTH);
      const y = Math.floor(Math.random() * HEIGHT);
      tmp.setPixel(x, y, 255);
    }
  },
  100
);

// Summary
console.log("=== Summary ===\n");
console.log("Performance with Uint8ClampedArray optimization:");
console.log(`  - Grayscale: ${(grayTime / 100).toFixed(2)}ms per frame`);
console.log(
  `  - Threshold: ${(threshTime / 100).toFixed(2)}ms per frame`
);
console.log(`  - Blur: ${(blurTime / 20).toFixed(2)}ms per frame`);
console.log(
  `  - Pipeline: ${(pipelineTime / 50).toFixed(2)}ms per frame`
);
console.log(`  - Memory: ${(img.data.byteLength / 1024 / 1024).toFixed(2)} MB`);
console.log("");
console.log("Benefits:");
console.log("  ✓ Typed array operations are optimized by JavaScript engines");
console.log("  ✓ Memory-contiguous for CPU cache efficiency");
console.log("  ✓ Auto-clamping to 0-255 range");
console.log("  ✓ Compatible with Canvas ImageData (zero-copy)");
console.log("");
console.log("Real-time capability:");
const avgPipelineTime = pipelineTime / 50;
const fps = 1000 / avgPipelineTime;
console.log(
  `  Pipeline at ${fps.toFixed(1)} FPS (${avgPipelineTime.toFixed(2)}ms per frame)`
);
console.log(`  ${fps >= 30 ? "✓" : "✗"} Suitable for real-time processing (>30 FPS)`);
console.log(`  ${fps >= 60 ? "✓" : "✗"} Smooth real-time (>60 FPS)\n`);
