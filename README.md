[![codecov](https://codecov.io/github/kalwalt/ARuco-ts/graph/badge.svg?token=HCHI5UYYYY)](https://codecov.io/github/kalwalt/ARuco-ts) [![CI](https://github.com/kalwalt/ARuco-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/kalwalt/ARuco-ts/actions/workflows/ci.yml) [![Build](https://github.com/kalwalt/ARuco-ts/actions/workflows/build.yml/badge.svg)](https://github.com/kalwalt/ARuco-ts/actions/workflows/build.yml) [![GitHub stars](https://img.shields.io/github/stars/kalwalt/ARuco-ts)](https://github.com/kalwalt/ARuco-ts/stargazers) [![GitHub forks](https://img.shields.io/github/forks/kalwalt/ARuco-ts)](https://github.com/kalwalt/ARuco-ts/network)

# 📊 ARuco-ts

A TypeScript version of the [js-aruco](https://github.com/jcmellado/js-aruco) library. It implements all the features and is now in a stable release stage.
Actually, it only supports 5x5 markers; more types will be added soon.

## 🔍 Examples

The `examples` folder contains sample HTML files demonstrating how to use aruco-ts:

- **simple.html** - Basic example to convert an image to grayscale
- **webcam_example.html** - Real-time marker detection using webcam
- **debug-posit.html** - Pose estimation debugging example

### Testing with ArUco Markers

To test the examples, you'll need an ArUco marker. You can:

1. **Print the included marker**: Use `examples/aruco-marker-33.pdf` (ArUco dictionary, ID 33)
2. **Generate your own**: Visit [ArUco Marker Generator](https://chev.me/arucogen/) and create a marker from the Original ARUCO dictionary
3. **Display on screen**: Open the marker image on another device and point your webcam at it

**Quick test:**

1. Open `examples/webcam_example.html` in your browser
2. Allow camera access
3. Show an ArUco marker to the camera
4. The detected marker corners and ID will be displayed

![ArUco Marker Example](examples/aruco-marker-33.png)

## 🛠️ Building the project

If you make changes to the code, you'll need to rebuild the project:

1. Install dependencies:

   ```
   npm install
   ```

2. Build the TypeScript code:

   ```
   npm run build-ts
   ```

3. Build the TypeScript code in development mode.
   ```
   npm run dev-ts
   ```

This will generate the JavaScript files needed for the library to work.

## ⚡ Performance

ARuco-ts is optimized for real-time computer vision using TypedArrays:

### Image Processing (Uint8ClampedArray)
- **5-10x faster** CV operations (grayscale, threshold, blur)
- **20x less memory** (1920×1080: ~40MB → ~2MB)
- **Zero-copy Canvas integration** (instant data transfer)
- **Real-time capable**: 36.8 FPS for complete processing pipeline

**1920×1080 Benchmarks:**
- Grayscale: 7.86ms (127 FPS)
- Threshold: 4.65ms (215 FPS)  
- Box Blur: 15.18ms (66 FPS)
- Complete Pipeline: 27.17ms (36.8 FPS)

### Math Operations (Float32Array)
- **Vec3/Mat3**: 1.1-1.7x speedup
- **~80% reduction** in garbage collection pressure

See [docs/IMAGE_OPTIMIZATION.md](docs/IMAGE_OPTIMIZATION.md) and [docs/PERFORMANCE.md](docs/PERFORMANCE.md) for detailed benchmarks.

## 🚀 Future development

- SIMD support for the marker detection.
- extends the Dictionary, so it will support other markers types (artoolkitplus, apriltag...).
- more examples
- add tests
