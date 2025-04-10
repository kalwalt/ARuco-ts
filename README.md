# 📊 ARuco-ts

 A typescript version of the [js-aruco](https://github.com/jcmellado/js-aruco) library. It implements all the features and is now in a stable release stage.
 Actually it only support 5x5 markers, more types will be added in a near future.
 
## 🔍 Examples

Try one of the examples below. Note that these examples must be run on a local server (localhost) due to browser security restrictions when accessing the camera and loading resources:

- examples/debug-posit.html 
- examples/simple.html
- examples/webcam_example.html

You can use tools like [http-server](https://www.npmjs.com/package/http-server) or the live server extension in VSCode to run the examples locally.

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

This will generate the JavaScript files needed for the library to work.

## 🚀 Future development

- SIMD support for the marker detection.
- add a Dictionary, so it will support other markers types (artoolkitplus, apriltag...).
- more examples
- add tests