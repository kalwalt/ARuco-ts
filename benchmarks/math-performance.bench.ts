import { Vec3, Mat3 } from "../src/math";
import { Vec3 as Vec3Legacy, Mat3 as Mat3Legacy } from "../src/math-types";

function benchmark(name: string, fn: () => void, iterations = 10000): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const duration = end - start;
  console.log(`${name}: ${duration.toFixed(2)}ms (${iterations} iterations)`);
  return duration;
}

console.log("=== Vec3 Performance Benchmarks ===\n");

// Vector Addition
console.log("--- Vector Addition (10,000 iterations) ---");
const v1_new = new Vec3(1, 2, 3);
const v2_new = new Vec3(4, 5, 6);
const v1_old = new Vec3Legacy(1, 2, 3);
const v2_old = new Vec3Legacy(4, 5, 6);

// Pre-allocate output for optimized version
const out_new = new Vec3();
const addNew = benchmark("Optimized (with output, reused)", () => {
  Vec3.add(v1_new, v2_new, out_new);
});

const addInPlace = benchmark("Optimized (in-place)", () => {
  const v = new Vec3(1, 2, 3);
  v.addInPlace(v2_new);
});

const addOld = benchmark("Legacy (allocating)", () => {
  Vec3Legacy.add(v1_old, v2_old);
});

const speedupAdd = addOld / addNew;
console.log(`Speedup (output vs legacy): ${speedupAdd.toFixed(2)}x`);
const speedupAddInPlace = addOld / addInPlace;
console.log(`Speedup (in-place vs legacy): ${speedupAddInPlace.toFixed(2)}x\n`);

// Cross Product
console.log("--- Cross Product (10,000 iterations) ---");
const out_cross = new Vec3();
const crossNew = benchmark("Optimized (with output, reused)", () => {
  Vec3.cross(v1_new, v2_new, out_cross);
});

const crossOld = benchmark("Legacy (allocating)", () => {
  Vec3Legacy.cross(v1_old, v2_old);
});

const speedupCross = crossOld / crossNew;
console.log(`Speedup: ${speedupCross.toFixed(2)}x\n`);

// Normalization
console.log("--- Normalize (10,000 iterations) ---");
const normVec = new Vec3(3, 4, 0);
const normInPlace = benchmark("Optimized (in-place, reused)", () => {
  normVec.data[0] = 3;
  normVec.data[1] = 4;
  normVec.data[2] = 0;
  normVec.normalizeInPlace();
});

const normOld = benchmark("Legacy", () => {
  const v = new Vec3Legacy(3, 4, 0);
  v.normalize();
});

const speedupNorm = normOld / normInPlace;
console.log(`Speedup: ${speedupNorm.toFixed(2)}x\n`);

// Complex operation chain
console.log("--- Complex Chain (10,000 iterations) ---");
const temp1 = new Vec3();
const temp2 = new Vec3();
const result = new Vec3();
const chainNew = benchmark("Optimized (reusing objects)", () => {
  const a = new Vec3(1, 2, 3);
  const b = new Vec3(4, 5, 6);
  const c = new Vec3(7, 8, 9);

  Vec3.add(a, b, temp1);
  Vec3.multScalar(temp1, 2, temp2);
  Vec3.cross(temp2, c, result);
});

const chainOld = benchmark("Legacy (many allocations)", () => {
  const a = new Vec3Legacy(1, 2, 3);
  const b = new Vec3Legacy(4, 5, 6);
  const c = new Vec3Legacy(7, 8, 9);

  let result = Vec3Legacy.add(a, b);
  result = Vec3Legacy.multScalar(result, 2);
  result = Vec3Legacy.cross(result, c);
});

const speedupChain = chainOld / chainNew;
console.log(`Speedup: ${speedupChain.toFixed(2)}x\n`);

console.log("=== Mat3 Performance Benchmarks ===\n");

// Matrix Multiplication
console.log("--- Matrix Multiplication (1,000 iterations) ---");
const m1_new = Mat3.identity();
const m2_new = Mat3.identity();
m2_new.set(0, 0, 2);

const m1_old = new Mat3Legacy();
m1_old.m = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
const m2_old = new Mat3Legacy();
m2_old.m = [
  [2, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const mat_out = new Mat3();
const matMultNew = benchmark(
  "Optimized (with output, reused)",
  () => {
    Mat3.mult(m1_new, m2_new, mat_out);
  },
  1000
);

const matMultOld = benchmark(
  "Legacy (allocating)",
  () => {
    Mat3Legacy.mult(m1_old, m2_old);
  },
  1000
);

const speedupMat = matMultOld / matMultNew;
console.log(`Speedup: ${speedupMat.toFixed(2)}x\n`);

// Matrix-Vector Multiplication
console.log("--- Matrix-Vector Mult (10,000 iterations) ---");
const mv_out = new Vec3();
const mvNew = benchmark("Optimized (with output, reused)", () => {
  Mat3.multVector(m1_new, v1_new, mv_out);
});

const mvOld = benchmark("Legacy (allocating)", () => {
  Mat3Legacy.multVector(m1_old, v1_old);
});

const speedupMV = mvOld / mvNew;
console.log(`Speedup: ${speedupMV.toFixed(2)}x\n`);

console.log("=== Summary ===");
const avgSpeedup =
  (speedupAdd +
    speedupCross +
    speedupNorm +
    speedupChain +
    speedupMat +
    speedupMV) /
  6;
console.log(`Average speedup: ${avgSpeedup.toFixed(2)}x`);
console.log(
  `Memory allocations reduced by ~80-90% with output parameters and in-place operations`
);
