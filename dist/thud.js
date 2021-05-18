/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/game.js */ \"./src/models/game.js\");\n/* harmony import */ var _models_game_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_models_game_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/controller.js */ \"./src/lib/controller.js\");\n/* harmony import */ var _lib_controller_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib_controller_js__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nconsole.log((_models_game_js__WEBPACK_IMPORTED_MODULE_0___default()));\n\n\ngame = new (_models_game_js__WEBPACK_IMPORTED_MODULE_0___default())(\n  {\n    reporters: ['Canvas', 'Console'],\n    dwarf_client: 'Manual',\n    troll_client: 'Manual'\n  }\n);\ngame.report('score');\n\n\n//# sourceURL=webpack://Thud/./src/index.js?");

/***/ }),

/***/ "./src/lib/controller.js":
/*!*******************************!*\
  !*** ./src/lib/controller.js ***!
  \*******************************/
/***/ ((module) => {

eval("class Controller {\n  constructor(game, side) {\n    this.game = game;\n    this.side = side;\n    this.current_space = null;\n    this.helper = new ControllerHelper(this);\n  }\n\n  turn() {\n    var controller = this;\n    return this.wrapper(() => {\n      controller.game.turn();\n    });\n  }\n\n  scores() {\n    var controller = this;\n    return this.wrapper(() => controller.game.get_score());\n  }\n\n  previous_move() {\n    var controller = this;\n    return this.wrapper(() => Object.assign(controller.game.previous_move));\n  }\n\n  spaces() {\n    var controller = this;\n    return this.wrapper(() => {\n      return Array.from(\n        controller.game.board.spaces(),\n        space => this.helper.space_proxy(space)\n      );\n    });\n  }\n\n  dwarves() {\n    var controller = this;\n    return this.wrapper(() => {\n        return Array.from(\n          controller.game.dwarves,\n          dwarf => ({x: dwarf.x, y: dwarf.y})\n        );\n      }\n    );\n  }\n\n  trolls() {\n    var controller = this;\n    return this.wrapper(() => {\n        return Array.from(\n          controller.game.trolls,\n          troll => ({x: troll.x, y: troll.y})\n        );\n      }\n    );\n  }\n\n\n// Actual actions\n  check_space(x, y) {\n    var controller = this;\n    return controller.wrapper(\n      () => {\n        var space = controller.game.board.space(x, y);\n        var moves = controller.helper.moves_for(space);\n        controller.game.report('highlight_space', controller.checked_space);\n        return moves;\n      }\n    );\n  }\n\n  select_space(x, y) {\n    var controller = this;\n    return controller.wrapper(\n      () => {\n        var space = controller.helper.space_proxy(controller.game.board.space(x, y));\n        if (space) {\n          if (!controller.checked_space || controller.checked_space.x != x || controller.checked_space.y != y) {\n            controller.helper.moves_for(space);\n          }\n          if (space.piece && space.piece == controller.side) {\n            controller.current_space = space;\n            return true;\n          } else {\n            controller.clear_space();\n            return false;\n          }\n        }\n      }\n    );\n  }\n\n  check_move(x, y) {\n    var target_space = this.game.board.space(x, y);\n    if (this.current_space && target_space) {\n      var moves = this.helper.moves_for(this.current_space);\n      var move = moves.find(move => move.x == x && move.y == y);\n      if (move) {\n        if (this.side == 'd') {\n          var kills;\n          var targets;\n          if (move.type == 'hurl') {\n            kills = 1;\n            targets = [{x: target_space.x, y: target_space.y}]\n          } else if (move.type == 'walk') {\n            kills = 0;\n          }\n          move.side = 'd';\n          this.game.report('highlight_move', move);\n          return {valid: true, type: move.type, kills: kills, targets};\n        } else if (this.side == 't') {\n          move.side = 't';\n          move.targets = target_space.neighbours\n            .filter(neighbour => neighbour.piece && neighbour.piece.type == 'd')\n            .map(dwarf => ({x: dwarf.x, y: dwarf.y}));\n          this.game.report('highlight_move', move);\n          return {valid: true, type: move.type, kills: move.targets.length, targets: move.targets};\n        } else {\n          return {valid: false, type: null, kills: 0, targets: []};\n        }\n      } else {\n        return {valid: false, type: null, kills: 0, targets: []};\n      }\n    }\n  }\n\n  move(x, y) {\n    var controller = this;\n    return controller.wrapper(\n      () => {\n        var target = controller.checked_space.moves.find(\n          space => space.x == x && space.y == y\n        )\n        if (target) {\n          controller.game.move_piece(target.x, target.y, target.type);\n          if (this.side == 't') {\n            controller.helper.troll_swing(target.x, target.y);\n          }\n          controller.clear_space();\n          controller.game.end_turn();\n        } else {\n          controller.clear_space();\n        }\n      }\n    );\n  }\n\n  clear_space() {\n    this.current_space = null;\n    this.checked_space = null;\n    this.game.report('board_state');\n  }\n\n  wrapper(func) {\n    if (this.game.current_side == this.side) {\n      return func();\n    } else {\n      return null;\n    }\n  }\n}\n\nmodule.exports = {Controller: Controller};\n\n//# sourceURL=webpack://Thud/./src/lib/controller.js?");

/***/ }),

/***/ "./src/models/game.js":
/*!****************************!*\
  !*** ./src/models/game.js ***!
  \****************************/
/***/ ((module) => {

eval("class Game {\n\n  static max_game_length = 200;\n\n  constructor(attrs) {\n    this.initialise_properties();\n    this.init_board();\n    this.init_reporters(attrs);\n    this.init_clients(attrs);\n    this.report('score');\n    this.current_side = 'd';\n    this.turn();\n  }\n\n  init_board() {\n    this.board = new Board(this);\n  }\n\n  initialise_properties() {\n    this.dwarves = [];\n    this.trolls = [];\n    this.turn_number = 0;\n    this.dwarf_controller = new Controller(this, 'd');\n    this.troll_controller = new Controller(this, 't');\n    this.previous_move = {\n      from: {x: 0, y: 0},\n      to: {x: 0, y: 0},\n      type: 'game_start',\n      killed: 0,\n      lost: 0\n    }\n\n  }\n\n  init_reporters(attrs) {\n    var game = this;\n    game.reporters = []\n    if (attrs.reporters) {\n      attrs.reporters.forEach(\n        reporter_name => game.attach_reporter(reporter_name)\n      );\n    }\n  }\n\n  attach_reporter(name) {\n    this.reporters.push(new Reporters[name](this));\n  }\n\n  report(event, args = {}) {\n    this.reporters.forEach(reporter => reporter[event](args));\n  }\n\n  init_clients(attrs) {\n    this.clients = {\n      d: this.init_client(attrs.dwarf_client, this.dwarf_controller),\n      t: this.init_client(attrs.troll_client, this.troll_controller)\n    }\n  }\n\n  init_client(client_type, controller) {\n    if (typeof client_type == 'string') {\n      var client_class = Clients[client_type];\n      return new client_class(this, controller);\n    } else {\n      return new client_type(this, controller);\n    }\n  }\n\n  get_score() {\n    var dwarf_score = this.dwarves.length\n    var troll_score = (this.trolls.length * 4)\n    var winning = ((dwarf_score > troll_score) ? 'd' : 't')\n    if (dwarf_score == troll_score) {\n      winning = '?'\n    }\n    return {\n      dwarves: dwarf_score,\n      trolls: troll_score,\n      difference: Math.abs(dwarf_score - troll_score),\n      winning: winning\n    }\n  }\n\n  turn() {\n    this.turn_number += 1;\n    this.report('turn_starts', {side: this.current_side, turn: this.turn_number})\n    this.current_client().turn();\n  }\n\n  end_turn() {\n    this.current_client().end_turn();\n    this.swap_side();\n    this.report('board_state');\n    this.report('score');\n    var ending = this.check_ending_conditions();\n    if (ending) {\n      this.report('game_ended', ending);\n    } else {\n      this.turn();\n    }\n  }\n\n  current_client() {\n    return this.clients[this.current_side];\n  }\n\n  swap_side() {\n    this.current_side = (this.current_side == 'd') ? 't' : 'd';\n  }\n\n  // move current piece (from select_space) to x, y\n  move_piece(x, y, type) {\n    var from = this.board.space(\n      this.current_client().controller.current_space.x,\n      this.current_client().controller.current_space.y\n    );\n    var to = this.board.space(x, y);\n    this.report(\n      'move',\n      {\n        side: from.piece.type,\n        from: {x: from.x, y: from.y},\n        to: {x: to.x, y: to.y},\n        type: type\n      }\n    )\n    if (to.piece) {\n      this.report('piece_taken', {x: to.x, y: to.y, side: to.piece.type});\n      this.remove_piece(to);\n    }\n    to.piece = from.piece;\n    from.piece = null;\n    to.piece.x = to.x;\n    to.piece.y = to.y;\n  }\n\n  remove_piece(space) {\n    Utils.remove_from_array(this.trolls, space.piece);\n    Utils.remove_from_array(this.dwarves, space.piece);\n    space.piece = null;\n  }\n\n  check_ending_conditions() {\n    if(this.turn_number >= Game.max_game_length) {\n      return {reason: 'Timeout'}\n    } else if (this.dwarves.length == 0) {\n      return {reason: 'No more dwarves'}\n    } else if (this.trolls.length == 0) {\n      return {reason: 'No more trolls'}\n    }\n    // TODO End game by consensus\n  }\n}\n\nmodule.exports = Game;\n\n//# sourceURL=webpack://Thud/./src/models/game.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;