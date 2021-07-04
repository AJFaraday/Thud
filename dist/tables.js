/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var Game;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lib/utils.js":
/*!**************************!*\
  !*** ./src/lib/utils.js ***!
  \**************************/
/***/ ((module) => {

eval("Utils = {\n  build_element: (name, attrs = {}, style = {}) => {\n    var el = document.createElement(name);\n    Object.entries(attrs).forEach(attr => el.setAttribute(attr[0], attr[1]))\n    if (Object.keys(style).length > 0) {\n      Object.entries(style).forEach(style_rule => el.style[style_rule[0]] = style_rule[1]);\n    }\n    return el;\n  },\n\n  _eventHandlers: {},\n\n  addListener: (node, event, handler, capture = false) => {\n    if (!(event in Utils._eventHandlers)) {\n      Utils._eventHandlers[event] = [];\n    }\n    // here we track the events and their nodes (note that we cannot\n    // use node as Object keys, as they'd get coerced into a string\n    Utils._eventHandlers[event].push({node: node, handler: handler, capture: capture})\n    node.addEventListener(event, handler, capture)\n  },\n\n\n  removeAllListeners: (targetNode, event) => {\n    // remove listeners from the matching nodes\n    Utils._eventHandlers[event]\n      .filter(({node}) => node === targetNode)\n      .forEach(({node, handler, capture}) => node.removeEventListener(event, handler, capture))\n\n    // update _eventHandlers global\n    Utils._eventHandlers[event] = Utils._eventHandlers[event].filter(\n      ({node}) => node !== targetNode,\n    )\n  },\n\n  remove_from_array: (array, object) => {\n    if (array.includes(object)) {\n      array.splice(array.indexOf(object), 1);\n    }\n  },\n\n  nullify_from_array: (array, object) => {\n    if (array.includes(object)) {\n      array[array.indexOf(object)] = null;\n    }\n  },\n\n  distance_box: (x, y, distance) => {\n    var coords = [];\n    var first_row = y - distance;\n    var last_row = y + distance;\n    Utils.index_array((distance * 2) + 1).forEach((idx) => {\n      coords.push({x: (x - idx + distance), y: first_row});\n    });\n    Utils.index_array((distance * 2) - 1).forEach((idx) => {\n      coords.push({x: (x - distance), y: (first_row + idx + 1)});\n      coords.push({x: (x + distance), y: (first_row + idx + 1)});\n    });\n    Utils.index_array((distance * 2) + 1).forEach((idx) => {\n      coords.push({x: (x - idx + distance), y: last_row});\n    });\n    return coords;\n  },\n\n  index_array: (size) => {\n    return Array.from(new Array(size), (_, i) => {\n      return i;\n    });\n  },\n\n  // Source and target both respond to x and y.\n  distance_between(source, target) {\n    var x_dist = Math.abs(source.x - target.x);\n    var y_dist = Math.abs(source.y - target.y);\n    return Math.max(x_dist, y_dist);\n  }\n};\n\nmodule.exports = Utils;\n\n\n//# sourceURL=webpack://Game/./src/lib/utils.js?");

/***/ }),

/***/ "./src/results/data/tables.js":
/*!************************************!*\
  !*** ./src/results/data/tables.js ***!
  \************************************/
/***/ ((module) => {

eval("module.exports = {\"dwarf\":[{\"name\":\"dwarf/default/keep_away\",\"win\":4,\"lose\":0,\"score\":83},{\"name\":\"dwarf/ajfaraday/baby_steps\",\"win\":3,\"lose\":1,\"score\":-22},{\"name\":\"dwarf/shaggy/baby_steps_duplicate\",\"win\":3,\"lose\":1,\"score\":-22},{\"name\":\"dwarf/default/lucky_7\",\"win\":0,\"lose\":4,\"score\":-38}],\"troll\":[{\"name\":\"troll/default/spread_out\",\"win\":3,\"lose\":1,\"score\":71},{\"name\":\"troll/ajfaraday/_imported\",\"win\":1,\"lose\":3,\"score\":-24},{\"name\":\"troll/default/last_move\",\"win\":1,\"lose\":3,\"score\":-24},{\"name\":\"troll/shaggy/_imported_duplicate\",\"win\":1,\"lose\":3,\"score\":-24}],\"overall\":[{\"name\":\"dwarf/default/keep_away\",\"win\":4,\"lose\":0,\"score\":83},{\"name\":\"troll/default/spread_out\",\"win\":3,\"lose\":1,\"score\":71},{\"name\":\"dwarf/ajfaraday/baby_steps\",\"win\":3,\"lose\":1,\"score\":-22},{\"name\":\"dwarf/shaggy/baby_steps_duplicate\",\"win\":3,\"lose\":1,\"score\":-22},{\"name\":\"troll/ajfaraday/_imported\",\"win\":1,\"lose\":3,\"score\":-24},{\"name\":\"troll/default/last_move\",\"win\":1,\"lose\":3,\"score\":-24},{\"name\":\"troll/shaggy/_imported_duplicate\",\"win\":1,\"lose\":3,\"score\":-24},{\"name\":\"dwarf/default/lucky_7\",\"win\":0,\"lose\":4,\"score\":-38}]}\n\n//# sourceURL=webpack://Game/./src/results/data/tables.js?");

/***/ }),

/***/ "./src/results/tables.js":
/*!*******************************!*\
  !*** ./src/results/tables.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _data_tables_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data/tables.js */ \"./src/results/data/tables.js\");\n/* harmony import */ var _data_tables_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_data_tables_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../lib/utils */ \"./src/lib/utils.js\");\n/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib_utils__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nclass Tables {\n\n  constructor() {\n    this.draw();\n  }\n\n  draw() {\n    this.draw_table('dwarf_table', (_data_tables_js__WEBPACK_IMPORTED_MODULE_0___default().dwarf));\n    this.draw_table('troll_table', (_data_tables_js__WEBPACK_IMPORTED_MODULE_0___default().troll));\n    this.draw_table('full_table', (_data_tables_js__WEBPACK_IMPORTED_MODULE_0___default().overall));\n  }\n\n  draw_table(target, data) {\n    var table = _lib_utils__WEBPACK_IMPORTED_MODULE_1___default().build_element('table', {class: 'league_table'});\n    var thead = _lib_utils__WEBPACK_IMPORTED_MODULE_1___default().build_element('thead');\n    ['Client', 'Win', 'Lose', 'Score'].forEach(header => {\n      var th = _lib_utils__WEBPACK_IMPORTED_MODULE_1___default().build_element('th');\n      th.innerHTML = header;\n      thead.append(th);\n    });\n    table.append(thead);\n    var tbody = _lib_utils__WEBPACK_IMPORTED_MODULE_1___default().build_element('tbody');\n    data.forEach(row_data => {\n      tbody.append(this.draw_row(row_data));\n    });\n    table.append(tbody);\n    document.getElementById(target).append(table);\n  }\n\n  draw_row(data) {\n    var kls = data.name.startsWith('dwarf/') ? 'dwarf' : 'troll';\n    var tr = _lib_utils__WEBPACK_IMPORTED_MODULE_1___default().build_element('tr', {class: kls});\n    ['name', 'win', 'lose', 'score'].forEach(attr => {\n      var td = _lib_utils__WEBPACK_IMPORTED_MODULE_1___default().build_element('td');\n      td.innerHTML = data[attr];\n      tr.append(td);\n    });\n    return tr;\n  }\n\n}\n\nwindow.tables = new Tables();\n\n//# sourceURL=webpack://Game/./src/results/tables.js?");

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/results/tables.js");
/******/ 	Game = __webpack_exports__;
/******/ 	
/******/ })()
;