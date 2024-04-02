(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/CV.ts":
/*!*******************!*\
  !*** ./src/CV.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CV: () => (/* binding */ CV),
/* harmony export */   Image: () => (/* binding */ Image)
/* harmony export */ });
class Image {
    width;
    height;
    data;
    constructor(width, height, data) {
        this.width = width;
        this.height = height;
        this.data = data;
    }
}
class CV {
    static grayscale(imageSrc, imageDst) {
        let src = imageSrc.data;
        let dst = imageDst.data;
        console.log(dst);
        let len = src.length;
        let i = 0;
        let j = 0;
        for (; i < len; i += 4) {
            dst[j++] =
                (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114 + 0.5) & 0xff;
        }
        var imageData = new ImageData(dst, imageSrc.width, imageSrc.height);
        imageDst = imageData;
        return imageDst;
    }
    ;
    static threshold(imageSrc, imageDst, threshold) {
        let src = imageSrc.data, dst = imageDst.data, len = src.length, tab = [], i;
        for (i = 0; i < 256; ++i) {
            tab[i] = i <= threshold ? 0 : 255;
        }
        for (i = 0; i < len; ++i) {
            dst[i] = tab[src[i]];
        }
        var imageData = new ImageData(dst, imageSrc.width, imageSrc.height);
        imageDst = imageData;
        return imageDst;
    }
    ;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CV: () => (/* binding */ CV)
/* harmony export */ });
/* harmony import */ var _CV__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CV */ "./src/CV.ts");


var CV;
(function (CV) {
    CV.Image = _CV__WEBPACK_IMPORTED_MODULE_0__.Image;
    CV.grayscale = _CV__WEBPACK_IMPORTED_MODULE_0__.CV.grayscale;
    CV.threshold = _CV__WEBPACK_IMPORTED_MODULE_0__.CV.threshold;
})(CV || (CV = {}));

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQ0o7QUFFekIsSUFBVSxFQUFFLENBSWxCO0FBSkQsV0FBaUIsRUFBRTtJQUNGLFFBQUssR0FBRyxzQ0FBTSxDQUFDO0lBQ2YsWUFBUyxHQUFHLG1DQUFHLENBQUMsU0FBUyxDQUFDO0lBQzFCLFlBQVMsR0FBRyxtQ0FBRyxDQUFDLFNBQVMsQ0FBQztBQUMzQyxDQUFDLEVBSmdCLEVBQUUsS0FBRixFQUFFLFFBSWxCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXJ1Y28tdHMvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2FydWNvLXRzLy4vc3JjL0NWLnRzIiwid2VicGFjazovL2FydWNvLXRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FydWNvLXRzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hcnVjby10cy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FydWNvLXRzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYXJ1Y28tdHMvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHRoaXMsICgpID0+IHtcbnJldHVybiAiLCJleHBvcnQgY2xhc3MgSW1hZ2Uge1xyXG4gICAgcHJpdmF0ZSB3aWR0aDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBoZWlnaHQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgZGF0YTogVWludDhDbGFtcGVkQXJyYXk7XHJcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgZGF0YTogVWludDhDbGFtcGVkQXJyYXkpIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBDViB7XHJcbiAgICBzdGF0aWMgZ3JheXNjYWxlKGltYWdlU3JjOiBJbWFnZURhdGEsIGltYWdlRHN0OiBJbWFnZURhdGEpOiBJbWFnZURhdGEge1xyXG4gICAgICAgIGxldCBzcmM6IFVpbnQ4Q2xhbXBlZEFycmF5ID0gaW1hZ2VTcmMuZGF0YTtcclxuICAgICAgICBsZXQgZHN0OiBVaW50OENsYW1wZWRBcnJheSA9IGltYWdlRHN0LmRhdGE7XHJcbiAgICAgICAgY29uc29sZS5sb2coZHN0KVxyXG4gICAgICAgIGxldCBsZW46IG51bWJlciA9IHNyYy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IGk6IG51bWJlciA9IDA7XHJcbiAgICAgICAgbGV0IGo6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgZHN0W2orK10gPVxyXG4gICAgICAgICAgICAgICAgKHNyY1tpXSAqIDAuMjk5ICsgc3JjW2kgKyAxXSAqIDAuNTg3ICsgc3JjW2kgKyAyXSAqIDAuMTE0ICsgMC41KSAmIDB4ZmY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW1hZ2VEYXRhOiBJbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKGRzdCwgaW1hZ2VTcmMud2lkdGgsIGltYWdlU3JjLmhlaWdodClcclxuXHJcbiAgICAgICAgaW1hZ2VEc3QgPSBpbWFnZURhdGE7XHJcblxyXG4gICAgICAgIHJldHVybiBpbWFnZURzdDtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyB0aHJlc2hvbGQgKGltYWdlU3JjOiBJbWFnZURhdGEsIGltYWdlRHN0OiBJbWFnZURhdGEsIHRocmVzaG9sZDogbnVtYmVyKTogSW1hZ2VEYXRhe1xyXG4gICAgICAgIGxldCBzcmMgPSBpbWFnZVNyYy5kYXRhLCBkc3QgPSBpbWFnZURzdC5kYXRhLFxyXG4gICAgICAgICAgICBsZW4gPSBzcmMubGVuZ3RoLCB0YWIgPSBbXSwgaTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDI1NjsgKysgaSl7XHJcbiAgICAgICAgICAgIHRhYltpXSA9IGkgPD0gdGhyZXNob2xkPyAwOiAyNTU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArKyBpKXtcclxuICAgICAgICAgICAgZHN0W2ldID0gdGFiWyBzcmNbaV0gXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpbWFnZURhdGE6IEltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoZHN0LCBpbWFnZVNyYy53aWR0aCwgaW1hZ2VTcmMuaGVpZ2h0KVxyXG5cclxuICAgICAgICBpbWFnZURzdCA9IGltYWdlRGF0YTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGltYWdlRHN0O1xyXG4gICAgfTtcclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtJbWFnZSBhcyBfSW1hZ2V9IGZyb20gJy4vQ1YnXHJcbmltcG9ydCB7IENWIGFzIF9DViB9IGZyb20gJy4vQ1YnXHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIENWIHtcclxuICAgIGV4cG9ydCBjb25zdCBJbWFnZSA9IF9JbWFnZTtcclxuICAgIGV4cG9ydCBjb25zdCBncmF5c2NhbGUgPSBfQ1YuZ3JheXNjYWxlO1xyXG4gICAgZXhwb3J0IGNvbnN0IHRocmVzaG9sZCA9IF9DVi50aHJlc2hvbGQ7XHJcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=