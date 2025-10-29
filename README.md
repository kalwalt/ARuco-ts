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

## 🚀 Future development

- SIMD support for the marker detection.
- extends the Dictionary, so it will support other markers types (artoolkitplus, apriltag...).
- more examples
- add tests
