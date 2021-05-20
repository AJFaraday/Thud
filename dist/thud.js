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

/***/ "./src/clients.js":
/*!************************!*\
  !*** ./src/clients.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = {\n  Manual: __webpack_require__(/*! ./clients/manual.js */ \"./src/clients/manual.js\"),\n  Dummy: __webpack_require__(/*! ./clients/dummy.js */ \"./src/clients/dummy.js\")\n};\n\n\n//# sourceURL=webpack://Thud/./src/clients.js?");

/***/ }),

/***/ "./src/clients/dummy.js":
/*!******************************!*\
  !*** ./src/clients/dummy.js ***!
  \******************************/
/***/ ((module) => {

eval("class Dummy {\n  constructor(game, controller) {\n    this.game = game;\n    this.controller = controller;\n    this.side = controller.side;\n  }\n\n  turn() {\n  }\n\n  end_turn() {\n  }\n\n\n}\n\nmodule.exports = Dummy;\n\n\n//# sourceURL=webpack://Thud/./src/clients/dummy.js?");

/***/ }),

/***/ "./src/clients/manual.js":
/*!*******************************!*\
  !*** ./src/clients/manual.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Utils = __webpack_require__(/*! ./../lib/utils.js */ \"./src/lib/utils.js\");\nconst Reporters = __webpack_require__(/*! ./../reporters.js */ \"./src/reporters.js\");\n\n// This is strongly coupled with Reporters.Canvas\nclass Manual {\n  constructor(game, controller) {\n    this.game = game;\n    this.controller = controller;\n    this.side = controller.side;\n\n    this.canvas = document.querySelector(\"#thud_board canvas\");\n  }\n\n  turn() {\n    Utils.addListener(this.canvas, 'mousemove', e => this.mouseover(e), false);\n    Utils.addListener(this.canvas, 'mouseup', e => this.mouseup(e), false);\n    Utils.addListener(this.canvas, 'contextmenu', e => this.debug_space(e), false);\n    Utils.addListener(this.declare_button(), 'mouseup', e => this.declare(), false);\n  }\n\n  end_turn() {\n    Utils.removeAllListeners(this.canvas, 'mousemove');\n    Utils.removeAllListeners(this.canvas, 'mouseup');\n    Utils.removeAllListeners(this.canvas, 'contextmenu');\n    Utils.removeAllListeners(this.declare_button(), 'mouseup');\n  }\n\n\n  mouseover(event) {\n    var space = this.space_at(event.offsetX, event.offsetY);\n    if (space) {\n      if (this.controller.current_space) {\n        this.controller.check_move(space.x, space.y);\n      } else {\n        this.controller.check_space(space.x, space.y);\n      }\n    }\n  }\n\n  mouseup(event) {\n    var space = this.space_at(event.offsetX, event.offsetY);\n    if (space) {\n      if (this.controller.current_space) {\n        this.controller.move(space.x, space.y);\n      } else {\n        this.controller.select_space(space.x, space.y);\n      }\n    }\n  }\n\n  debug_space(event) {\n    event.preventDefault();\n    var space = this.space_at(event.offsetX, event.offsetY);\n    if (space.piece) {\n      console.log(space.piece)\n    } else {\n      console.log(space)\n    }\n  }\n\n  space_at(x, y) {\n    return this.game.board.space(\n      Math.floor(x / Reporters.Canvas.space_size),\n      Math.floor(y / Reporters.Canvas.space_size)\n    );\n  }\n\n  declare_button() {\n    if (this.side == 'd') {\n      return document.getElementById('dwarf_declare_button');\n    } else if (this.side == 't') {\n      return document.getElementById('troll_declare_button');\n    }\n  }\n\n  declare() {\n    var button = this.declare_button();\n    button.dataset.over = button.dataset.over != 'true';\n    this.controller.declare(button.dataset.over == 'true');\n  }\n\n}\n\nmodule.exports = Manual;\n\n\n//# sourceURL=webpack://Thud/./src/clients/manual.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/game.js */ \"./src/models/game.js\");\n/* harmony import */ var _models_game_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_models_game_js__WEBPACK_IMPORTED_MODULE_0__);\n\n\nvar game = new (_models_game_js__WEBPACK_IMPORTED_MODULE_0___default())(\n  {\n    reporters: ['Canvas', 'Console'],\n    dwarf_client: 'Manual',\n    troll_client: 'Manual'\n  }\n);\n\n\n\n//# sourceURL=webpack://Thud/./src/index.js?");

/***/ }),

/***/ "./src/lib/controller.js":
/*!*******************************!*\
  !*** ./src/lib/controller.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const ControllerHelper = __webpack_require__(/*! ./controller_helper.js */ \"./src/lib/controller_helper.js\");\n\n\nclass Controller {\n  constructor(game, side) {\n    this.game = game;\n    this.side = side;\n    this.current_space = null;\n    this.helper = new ControllerHelper(this);\n  }\n\n  turn() {\n    var controller = this;\n    return this.wrapper(() => {\n      controller.game.turn();\n    });\n  }\n\n  scores() {\n    var controller = this;\n    return this.wrapper(() => controller.game.get_score());\n  }\n\n  previous_move() {\n    var controller = this;\n    return this.wrapper(() => Object.assign(controller.game.previous_move));\n  }\n\n  spaces() {\n    var controller = this;\n    return this.wrapper(() => {\n      return Array.from(\n        controller.game.board.spaces(),\n        space => this.helper.space_proxy(space)\n      );\n    });\n  }\n\n  dwarves() {\n    var controller = this;\n    return this.wrapper(() => {\n        return Array.from(\n          controller.game.dwarves,\n          dwarf => ({x: dwarf.x, y: dwarf.y})\n        );\n      }\n    );\n  }\n\n  trolls() {\n    var controller = this;\n    return this.wrapper(() => {\n        return Array.from(\n          controller.game.trolls,\n          troll => ({x: troll.x, y: troll.y})\n        );\n      }\n    );\n  }\n\n\n// Actual actions\n  check_space(x, y) {\n    var controller = this;\n    return controller.wrapper(\n      () => {\n        var space = controller.game.board.space(x, y);\n        var moves = controller.helper.moves_for(space);\n        controller.game.report('highlight_space', controller.checked_space);\n        return moves;\n      }\n    );\n  }\n\n  select_space(x, y) {\n    var controller = this;\n    return controller.wrapper(\n      () => {\n        var space = controller.helper.space_proxy(controller.game.board.space(x, y));\n        if (space) {\n          if (!controller.checked_space || controller.checked_space.x != x || controller.checked_space.y != y) {\n            controller.helper.moves_for(space);\n          }\n          if (space.piece && space.piece == controller.side) {\n            controller.current_space = space;\n            return true;\n          } else {\n            controller.clear_space();\n            return false;\n          }\n        }\n      }\n    );\n  }\n\n  check_move(x, y) {\n    var target_space = this.game.board.space(x, y);\n    if (this.current_space && target_space) {\n      var moves = this.helper.moves_for(this.current_space);\n      var move = moves.find(move => move.x == x && move.y == y);\n      if (move) {\n        if (this.side == 'd') {\n          var kills;\n          var targets;\n          if (move.type == 'hurl') {\n            kills = 1;\n            targets = [{x: target_space.x, y: target_space.y}]\n          } else if (move.type == 'walk') {\n            kills = 0;\n          }\n          move.side = 'd';\n          this.game.report('highlight_move', move);\n          return {valid: true, type: move.type, kills: kills, targets};\n        } else if (this.side == 't') {\n          move.side = 't';\n          move.targets = target_space.neighbours\n            .filter(neighbour => neighbour.piece && neighbour.piece.type == 'd')\n            .map(dwarf => ({x: dwarf.x, y: dwarf.y}));\n          this.game.report('highlight_move', move);\n          return {valid: true, type: move.type, kills: move.targets.length, targets: move.targets};\n        } else {\n          return {valid: false, type: null, kills: 0, targets: []};\n        }\n      } else {\n        return {valid: false, type: null, kills: 0, targets: []};\n      }\n    }\n  }\n\n  move(x, y) {\n    var controller = this;\n    return controller.wrapper(\n      () => {\n        var target = controller.checked_space.moves.find(\n          space => space.x == x && space.y == y\n        )\n        if (target) {\n          controller.game.move_piece(target.x, target.y, target.type);\n          if (this.side == 't') {\n            controller.helper.troll_swing(target.x, target.y);\n          }\n          controller.clear_space();\n          controller.game.end_turn();\n        } else {\n          controller.clear_space();\n        }\n      }\n    );\n  }\n\n  clear_space() {\n    this.current_space = null;\n    this.checked_space = null;\n    this.game.report('board_state');\n  }\n\n  declare(game_over) {\n    this.declared = game_over;\n    this.game.report('player_declared', {side: this.side, game_over: game_over});\n  }\n\n  opponent_declared() {\n    if (this.side == 'd') {\n      return this.game.troll_controller.declared;\n    } else if (this.side == 't') {\n      return this.game.dwarf_controller.declared;\n    }\n  }\n\n\n  wrapper(func) {\n    if (this.game.current_side == this.side) {\n      return func();\n    } else {\n      return null;\n    }\n  }\n}\n\nmodule.exports = Controller;\n\n//# sourceURL=webpack://Thud/./src/lib/controller.js?");

/***/ }),

/***/ "./src/lib/controller_helper.js":
/*!**************************************!*\
  !*** ./src/lib/controller_helper.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const MoveCalculator = __webpack_require__(/*! ./move_calculator.js */ \"./src/lib/move_calculator.js\");\n\nclass ControllerHelper {\n\n  constructor(controller) {\n    this.controller = controller;\n    this.side = controller.side;\n  }\n\n  game() {\n    return this.controller.game;\n  }\n\n  board() {\n    return this.game().board;\n  }\n\n  space_proxy(space) {\n    if (space) {\n      var piece\n      if (space.piece) {\n        piece = space.piece.type\n      } else {\n        piece = null\n      }\n      return {\n        x: space.x,\n        y: space.y,\n        piece: piece\n      }\n    } else {\n      return null;\n    }\n  }\n\n  moves_for(space) {\n    var move_calculator = new MoveCalculator(this.board(), space, this.game().current_side);\n    this.controller.checked_space = {\n      x: space.x,\n      y: space.y,\n      moves: move_calculator.moves\n    };\n    return move_calculator.moves;\n  }\n\n  // Troll in this space kills all adjacent dwarves\n  troll_swing(x, y) {\n    var space = this.board().space(x, y);\n    var nearby_dwarves = space.neighbours.filter(neighbour => neighbour.piece && neighbour.piece.type == 'd');\n    nearby_dwarves.forEach(dwarf => {\n      this.game().report('piece_taken', Object.assign(dwarf, {side: 'd'}));\n      this.game().remove_piece(dwarf);\n    });\n  }\n\n}\n\nmodule.exports = ControllerHelper;\n\n\n//# sourceURL=webpack://Thud/./src/lib/controller_helper.js?");

/***/ }),

/***/ "./src/lib/direction.js":
/*!******************************!*\
  !*** ./src/lib/direction.js ***!
  \******************************/
/***/ ((module) => {

eval("class Direction {\n\n  constructor(board, compass_point, x, y) {\n    this.board = board;\n    this.x = x;\n    this.y = y;\n    this.step = this.get_step(compass_point.toUpperCase());\n    this.spaces = this.get_spaces();\n  }\n\n  get_step(compass_point) {\n    var step = [0, 0];\n    if (compass_point.includes('S')) {\n      step[1] = 1;\n    } else if (compass_point.includes('N')) {\n      step[1] = -1;\n    }\n    if (compass_point.includes('E')) {\n      step[0] = 1;\n    } else if (compass_point.includes('W')) {\n      step[0] = -1;\n    }\n    return step;\n  }\n\n  get_spaces() {\n    var x = this.x;\n    var y = this.y;\n    var spaces = [];\n\n    var space = this.board.space(x, y);\n    while (space) {\n      spaces.push(space);\n      x += this.step[0];\n      y += this.step[1];\n      space = this.board.space(x, y);\n    }\n    return spaces;\n  }\n\n  empty_spaces() {\n    var found_spaces = [];\n    var i = 1\n    var space = this.spaces[i];\n    while(space && !space.piece) {\n      found_spaces.push(space);\n      i += 1\n      space = this.spaces[i];\n    }\n    return found_spaces;\n  }\n\n  // d or t in a line, including this one\n  pieces_in_line(type) {\n    var i = 0;\n    var space = this.spaces[i];\n    while(space && space.piece && space.piece.type == type) {\n      i += 1\n      var space = this.spaces[i];\n    }\n    return i;\n  }\n\n}\n\nmodule.exports = Direction;\n\n\n//# sourceURL=webpack://Thud/./src/lib/direction.js?");

/***/ }),

/***/ "./src/lib/move_calculator.js":
/*!************************************!*\
  !*** ./src/lib/move_calculator.js ***!
  \************************************/
/***/ ((module) => {

eval("class MoveCalculator {\n\n  constructor(board, space, side) {\n    this.board = board;\n    this.side = side;\n    // game is set for Space, but not space_proxy\n    this.space = ((space.game) ? space : this.board.space(space.x, space.y));\n    if (this.space && this.space.piece && this.space.piece.type == side) {\n      if (side == 'd') {\n        this.moves = this.dwarf_moves();\n      } else if (side == 't') {\n        this.moves = this.troll_moves();\n      } else {\n        this.moves = [];\n      }\n    } else {\n      this.moves = [];\n    }\n  }\n\n  dwarf_moves() {\n    var calculator = this;\n    var moves = [];\n    Object.values(calculator.space.directions).forEach(\n      direction => {\n        direction.empty_spaces().forEach(empty_space => moves.push({x: empty_space.x, y: empty_space.y, type: 'walk'}));\n        var hurl_distance = direction.opposite.pieces_in_line('d');\n        direction.spaces.slice(1, (hurl_distance + 1)).forEach(\n          (space, index) => {\n            if (space.piece && space.piece.type == 't' && calculator.space_between_is_empty(direction, index)) {\n              moves.push({x: space.x, y: space.y, type: 'hurl'});\n            }\n          }\n        )\n      }\n    );\n    return moves;\n  }\n\n  space_between_is_empty(direction, index) {\n    return direction.spaces.slice(1, (index + 1)).every(space => !space.peice);\n  }\n\n  troll_moves() {\n    var calculator = this;\n    var moves = [];\n    calculator.space.neighbours.filter(\n      neighbour => !neighbour.piece\n    ).forEach(\n      neighbour => moves.push(moves.push({x: neighbour.x, y: neighbour.y, type: 'walk'}))\n    );\n    calculator.space.neighbours.filter(\n      neighbour => (neighbour.piece && neighbour.piece.type == 'd')\n    ).forEach(\n      neighbour => moves.push(moves.push({x: neighbour.x, y: neighbour.y, type: 'take'}))\n    );\n\n    Object.values(calculator.space.directions).forEach(\n      (direction) => {\n        var shove_distance = direction.opposite.pieces_in_line('t');\n        direction.spaces.slice(2, shove_distance + 1).forEach(\n          (space, index) => {\n            if (\n              space.piece && space.piece.type == 'd' ||\n              (\n                calculator.space_between_is_empty(direction, index) &&\n                calculator.space_has_dwarf_neighours(space)\n              )\n            ) {\n              moves.push({x: space.x, y: space.y, type: 'shove'});\n            }\n          }\n        );\n      }\n    );\n    return moves;\n  }\n\n\n  space_has_dwarf_neighours(space) {\n    return space.neighbours.some(neighbour => neighbour.piece && neighbour.piece.type == 'd');\n  }\n}\n\nmodule.exports = MoveCalculator;\n\n//# sourceURL=webpack://Thud/./src/lib/move_calculator.js?");

/***/ }),

/***/ "./src/lib/utils.js":
/*!**************************!*\
  !*** ./src/lib/utils.js ***!
  \**************************/
/***/ ((module) => {

eval("Utils = {\n  build_element: (name, attrs = {}, style = {}) => {\n    var el = document.createElement(name);\n    Object.entries(attrs).forEach(attr => el.setAttribute(attr[0], attr[1]))\n    if (Object.keys(style).length > 0) {\n      Object.entries(style).forEach(style_rule => el.style[style_rule[0]] = style_rule[1]);\n    }\n    return el;\n  },\n\n  _eventHandlers: {},\n\n  addListener: (node, event, handler, capture = false) => {\n    if (!(event in Utils._eventHandlers)) {\n      Utils._eventHandlers[event] = [];\n    }\n    // here we track the events and their nodes (note that we cannot\n    // use node as Object keys, as they'd get coerced into a string\n    Utils._eventHandlers[event].push({node: node, handler: handler, capture: capture})\n    node.addEventListener(event, handler, capture)\n  },\n\n\n  removeAllListeners: (targetNode, event) => {\n    // remove listeners from the matching nodes\n    Utils._eventHandlers[event]\n      .filter(({node}) => node === targetNode)\n      .forEach(({node, handler, capture}) => node.removeEventListener(event, handler, capture))\n\n    // update _eventHandlers global\n    Utils._eventHandlers[event] = Utils._eventHandlers[event].filter(\n      ({node}) => node !== targetNode,\n    )\n  },\n\n  remove_from_array: (array, object) => {\n    if(array.includes(object)) {\n      array.splice(array.indexOf(object), 1);\n    }\n  }\n};\n\nmodule.exports = Utils;\n\n//# sourceURL=webpack://Thud/./src/lib/utils.js?");

/***/ }),

/***/ "./src/models/board.js":
/*!*****************************!*\
  !*** ./src/models/board.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Space = __webpack_require__(/*! ./space.js */ \"./src/models/space.js\"); \n\nclass Board {\n\n  static layout = [\n    \"#####dd dd#####\",\n    \"####d     d####\",\n    \"###d       d###\",\n    \"##d         d##\",\n    \"#d           d#\",\n    \"d             d\",\n    \"d     ttt     d\",\n    \"      t#t      \",\n    \"d     ttt     d\",\n    \"d             d\",\n    \"#d           d#\",\n    \"##d         d##\",\n    \"###d       d###\",\n    \"####d     d####\",\n    \"#####dd dd#####\"\n  ]\n\n  constructor(game) {\n    var board = this;\n    board.game = game;\n    board.build_spaces();\n    this.reporters = [];\n  }\n\n  build_spaces() {\n    var board = this;\n    board.rows = [];\n    Board.layout.forEach(\n      (row, row_index) => {\n        board.rows[row_index] = [];\n        row.split('').forEach(\n          (char, column_index) => {\n            if (char != '#') {\n              board.rows[row_index][column_index] = new Space(board.game, board, row_index, column_index, char);\n            }\n          }\n        )\n      }\n    );\n    // It's important this is after all spaces are initialised!\n    board.rows.forEach(\n      row => {\n        row.forEach(space => {\n          space.get_directions();\n          space.get_neighbours();\n        })\n      }\n    );\n  }\n\n  space(x, y) {\n    return this.rows[y] ? this.rows[y][x] : null;\n  }\n\n  spaces() {\n    var board = this;\n    if (typeof board.all_spaces == 'object') {\n      return board.all_spaces;\n    } else {\n      board.all_spaces = [];\n      board.rows.forEach(\n        row => board.all_spaces = board.all_spaces.concat(row.filter(Boolean))\n      );\n      return board.all_spaces;\n    }\n  }\n\n\n}\n\nmodule.exports = Board;\n\n//# sourceURL=webpack://Thud/./src/models/board.js?");

/***/ }),

/***/ "./src/models/dwarf.js":
/*!*****************************!*\
  !*** ./src/models/dwarf.js ***!
  \*****************************/
/***/ ((module) => {

eval("class Dwarf {\n  constructor(game, x, y) {\n    this.game = game;\n    this.game.dwarves.push(this);\n    this.x = x;\n    this.y = y;\n    this.type = 'd';\n  }\n}\n\nmodule.exports = Dwarf;\n\n//# sourceURL=webpack://Thud/./src/models/dwarf.js?");

/***/ }),

/***/ "./src/models/game.js":
/*!****************************!*\
  !*** ./src/models/game.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Controller = __webpack_require__(/*! ./../lib/controller.js */ \"./src/lib/controller.js\");\nconst Board = __webpack_require__(/*! ./board.js */ \"./src/models/board.js\");\nconst Reporters = __webpack_require__(/*! ../reporters.js */ \"./src/reporters.js\");\nconst Clients = __webpack_require__(/*! ../clients.js */ \"./src/clients.js\");\nconst Utils = __webpack_require__(/*! ./../lib/utils.js */ \"./src/lib/utils.js\");\n\nclass Game {\n\n  static max_game_length = 200;\n\n  constructor(attrs) {\n    this.initialise_properties();\n    this.init_board();\n    this.init_reporters(attrs);\n    this.init_clients(attrs);\n    this.report('score');\n    this.current_side = 'd';\n    this.turn();\n  }\n\n  init_board() {\n    this.board = new Board(this);\n  }\n\n  initialise_properties() {\n    this.dwarves = [];\n    this.trolls = [];\n    this.turn_number = 0;\n    this.dwarf_controller = new Controller(this, 'd');\n    this.troll_controller = new Controller(this, 't');\n    this.previous_move = {\n      from: {x: 0, y: 0},\n      to: {x: 0, y: 0},\n      type: 'game_start',\n      killed: 0,\n      lost: 0\n    }\n\n  }\n\n  init_reporters(attrs) {\n    var game = this;\n    game.reporters = []\n    if (attrs.reporters) {\n      attrs.reporters.forEach(\n        reporter_name => game.attach_reporter(reporter_name)\n      );\n    }\n  }\n\n  attach_reporter(name) {\n    this.reporters.push(new Reporters[name](this));\n  }\n\n  report(event, args = {}) {\n    this.reporters.forEach(reporter => reporter[event](args));\n  }\n\n  init_clients(attrs) {\n    this.clients = {\n      d: this.init_client(attrs.dwarf_client, this.dwarf_controller),\n      t: this.init_client(attrs.troll_client, this.troll_controller)\n    }\n  }\n\n  init_client(client_type, controller) {\n    if (typeof client_type == 'string') {\n      var client_class = Clients[client_type];\n      return new client_class(this, controller);\n    } else {\n      return new client_type(this, controller);\n    }\n  }\n\n  get_score() {\n    var dwarf_score = this.dwarves.length\n    var troll_score = (this.trolls.length * 4)\n    var winning = ((dwarf_score > troll_score) ? 'd' : 't')\n    if (dwarf_score == troll_score) {\n      winning = '?'\n    }\n    return {\n      dwarves: dwarf_score,\n      trolls: troll_score,\n      difference: Math.abs(dwarf_score - troll_score),\n      winning: winning\n    }\n  }\n\n  turn() {\n    this.turn_number += 1;\n    this.report('turn_starts', {side: this.current_side, turn: this.turn_number})\n    this.current_client().turn();\n  }\n\n  end_turn() {\n    this.current_client().end_turn();\n    this.swap_side();\n    this.report('board_state');\n    this.report('score');\n    var ending = this.check_ending_conditions();\n    if (ending) {\n      this.report('game_ended', ending);\n    } else {\n      this.turn();\n    }\n  }\n\n  current_client() {\n    return this.clients[this.current_side];\n  }\n\n  swap_side() {\n    this.current_side = (this.current_side == 'd') ? 't' : 'd';\n  }\n\n  // move current piece (from select_space) to x, y\n  move_piece(x, y, type) {\n    var from = this.board.space(\n      this.current_client().controller.current_space.x,\n      this.current_client().controller.current_space.y\n    );\n    var to = this.board.space(x, y);\n    this.report(\n      'move',\n      {\n        side: from.piece.type,\n        from: {x: from.x, y: from.y},\n        to: {x: to.x, y: to.y},\n        type: type\n      }\n    )\n    if (to.piece) {\n      this.report('piece_taken', {x: to.x, y: to.y, side: to.piece.type});\n      this.remove_piece(to);\n    }\n    to.piece = from.piece;\n    from.piece = null;\n    to.piece.x = to.x;\n    to.piece.y = to.y;\n  }\n\n  remove_piece(space) {\n    Utils.remove_from_array(this.trolls, space.piece);\n    Utils.remove_from_array(this.dwarves, space.piece);\n    space.piece = null;\n  }\n\n  check_ending_conditions() {\n    if(this.turn_number >= Game.max_game_length) {\n      return {reason: 'Timeout'}\n    } else if (this.dwarves.length == 0) {\n      return {reason: 'No more dwarves'}\n    } else if (this.trolls.length == 0) {\n      return {reason: 'No more trolls'}\n    } else if (this.troll_controller.declared && this.dwarf_controller.declared) {\n      return {reason: 'Players agreed to finish'}\n    }\n\n  }\n}\n\nmodule.exports = Game;\n\n//# sourceURL=webpack://Thud/./src/models/game.js?");

/***/ }),

/***/ "./src/models/space.js":
/*!*****************************!*\
  !*** ./src/models/space.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Direction = __webpack_require__(/*! ./../lib/direction.js */ \"./src/lib/direction.js\");\nconst Dwarf = __webpack_require__(/*! ./dwarf.js */ \"./src/models/dwarf.js\");\nconst Troll = __webpack_require__(/*! ./troll.js */ \"./src/models/troll.js\");\n\nclass Space {\n\n  static direction_list = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];\n\n  constructor(game, board, row_index, column_index, piece) {\n    this.game = game;\n    this.board = board;\n    this.x = column_index;\n    this.y = row_index;\n    this.colour_index = ((this.x + this.y) % 2);\n    switch (piece) {\n      case 'd':\n        this.piece = new Dwarf(this.game, this.x, this.y);\n        break;\n      case 't':\n        this.piece = new Troll(this.game, this.x, this.y);\n        break;\n    }\n  }\n\n  get_directions() {\n    var space = this;\n    space.directions = {};\n    Space.direction_list.forEach(\n      compass_point => {\n        space.directions[compass_point] = new Direction(\n          space.board,\n          compass_point,\n          space.x,\n          space.y\n        )\n      }\n    );\n    Object.values(space.directions).forEach(\n       (direction, index) => {\n        direction.opposite = space.directions[Space.direction_list[(index + 4) % 8]];\n      }\n    );\n  }\n\n  get_neighbours() {\n    var space = this;\n    space.neighbours = [];\n    Object.values(this.directions).forEach(\n      direction => {\n        if(direction.spaces[1]) {\n          space.neighbours.push(direction.spaces[1]);\n        }\n      }\n    );\n  }\n\n}\n\nmodule.exports = Space;\n\n\n//# sourceURL=webpack://Thud/./src/models/space.js?");

/***/ }),

/***/ "./src/models/troll.js":
/*!*****************************!*\
  !*** ./src/models/troll.js ***!
  \*****************************/
/***/ ((module) => {

eval("class Troll {\n  constructor(game, x, y) {\n    this.game = game;\n    this.game.trolls.push(this);\n    this.x = x;\n    this.y = y;\n    this.type = 't';\n  }\n}\nmodule.exports = Troll;\n\n//# sourceURL=webpack://Thud/./src/models/troll.js?");

/***/ }),

/***/ "./src/reporters.js":
/*!**************************!*\
  !*** ./src/reporters.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = {\n  Canvas: __webpack_require__(/*! ./reporters/canvas.js */ \"./src/reporters/canvas.js\"),\n  Console: __webpack_require__(/*! ./reporters/console.js */ \"./src/reporters/console.js\")\n};\n\n\n//# sourceURL=webpack://Thud/./src/reporters.js?");

/***/ }),

/***/ "./src/reporters/canvas.js":
/*!*********************************!*\
  !*** ./src/reporters/canvas.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Utils = __webpack_require__(/*! ./../lib/utils.js */ \"./src/lib/utils.js\");\n\nclass Canvas {\n\n  static space_colours = ['lightgrey', 'darkgrey'];\n  static space_size = 40;\n  static move_colours = {\n    walk: 'yellow',\n    hurl: 'red',\n    take: 'red',\n    shove: 'orange'\n  };\n\n  constructor(game) {\n    var reporter = this;\n    reporter.game = game;\n    reporter.board = game.board;\n    document.getElementById('thud').style['width'] = `${Canvas.space_size * 15}px`\n    reporter.build_overlay_canvas();\n    reporter.build_canvas();\n    reporter.build_dashboard();\n    reporter.draw_board();\n    reporter.build_declare_buttons();\n  }\n\n  build_canvas() {\n    this.canvas = Utils.build_element(\n      'canvas',\n      {\n        height: Canvas.space_size * 15,\n        width: Canvas.space_size * 15,\n        class: 'thud_canvas'\n      },\n      {\n        'background-color': 'black',\n        'z-index': 0\n      }\n    )\n    ;\n    this.context = this.canvas.getContext('2d');\n    document.getElementById('thud_board').append(this.canvas);\n  }\n\n  build_overlay_canvas() {\n    this.overlay_canvas = Utils.build_element(\n      'canvas',\n      {\n        height: Canvas.space_size * 15,\n        width: Canvas.space_size * 15,\n        class: 'thud_canvas'\n      },\n      {\n        'z-index': 1\n      }\n    );\n    this.overlay_context = this.overlay_canvas.getContext('2d');\n    document.getElementById('thud_board').append(this.overlay_canvas);\n  }\n\n  build_dashboard() {\n    this.dashboard = document.getElementById('thud_dashboard');\n    this.dwarf_side = this.build_side('blue', 'Dwarves');\n    this.centre = this.build_centre();\n    this.troll_side = this.build_side('green', 'Trolls');\n    this.dashboard.append(this.dwarf_side);\n    this.dashboard.append(this.centre);\n    this.dashboard.append(this.troll_side);\n  }\n\n  build_declare_buttons() {\n    this.dwarf_declare_button = Utils.build_element(\n      'div',\n      {\n        id: 'dwarf_declare_button',\n        class: 'declare_button dwarf',\n        'data-over': false\n      },\n      {float: 'left'}\n    );\n    this.dwarf_declare_button.innerHTML = 'Make Peace';\n    document.getElementById('buttons').append(this.dwarf_declare_button);\n    this.troll_declare_button = Utils.build_element(\n      'div',\n      {\n        id: 'troll_declare_button',\n        class: 'declare_button troll',\n        'data-over': false\n      },\n      {float: 'right'}\n    );\n    this.troll_declare_button.innerHTML = 'Make Peace';\n    document.getElementById('buttons').append(this.troll_declare_button);\n  }\n\n  build_side(colour, title) {\n    var side = Utils.build_element(\n      'div',\n      {class: 'dashboard_panel'},\n      {\n        'background-color': colour,\n        opacity: 0.7,\n        width: `${(Canvas.space_size * 6) - 5}px`\n      }\n    );\n    side.innerHTML = title\n    return side;\n  }\n\n  build_centre() {\n    return Utils.build_element(\n      'div',\n      {class: 'dashboard_centre'},\n      {\n        width: `${Canvas.space_size * 3}px`,\n      }\n    );\n  }\n\n  draw_board() {\n    var reporter = this;\n    reporter.clear_canvas();\n    reporter.board.rows.forEach(\n      row => row.forEach(space => reporter.draw_space(space, reporter))\n    );\n    reporter.game.dwarves.forEach(dwarf => reporter.draw_piece(dwarf, 'blue'));\n    reporter.game.trolls.forEach(troll => reporter.draw_piece(troll, 'green'));\n  }\n\n  clear_canvas() {\n    this.context.clearRect(\n      0,\n      0,\n      this.canvas.width,\n      this.canvas.height\n    );\n  }\n\n  draw_space(space) {\n    if (space) {\n      this.context.fillStyle = Canvas.space_colours[space.colour_index];\n      this.context.fillRect(\n        Canvas.space_size * space.x,\n        Canvas.space_size * space.y,\n        Canvas.space_size,\n        Canvas.space_size\n      );\n    }\n  }\n\n  outline_space(space, colour) {\n    if (space) {\n      this.context.strokeStyle = colour;\n      this.context.lineWidth = 3;\n      this.context.strokeRect(\n        Canvas.space_size * space.x,\n        Canvas.space_size * space.y,\n        Canvas.space_size,\n        Canvas.space_size\n      );\n    }\n  }\n\n  heavy_outline_space(space, colour) {\n    if (space) {\n      this.context.strokeStyle = colour;\n      this.context.lineWidth = 5;\n      this.context.strokeRect(\n        Canvas.space_size * space.x,\n        Canvas.space_size * space.y,\n        Canvas.space_size,\n        Canvas.space_size\n      );\n    }\n  }\n\n  draw_piece(space, colour) {\n    this.context.beginPath();\n    this.context.arc(\n      (Canvas.space_size * space.x) + (Canvas.space_size / 2),\n      Canvas.space_size * space.y + (Canvas.space_size / 2),\n      (Canvas.space_size / 2) * 0.8,\n      0,\n      2 * Math.PI);\n    this.context.fillStyle = colour;\n    this.context.fill();\n  }\n\n  // Main interface:\n\n  // Reports the current state of the board\n  // this.board.spaces\n  board_state(args) {\n    this.draw_board();\n  }\n\n  // It's the start of a player's turn\n  // args.side\n  // args.turn\n  turn_starts(args) {\n    if (args.side == 'd') {\n      this.dwarf_side.style.opacity = 1;\n      this.troll_side.style.opacity = 0.6;\n      this.dwarf_declare_button.style.opacity = 1;\n      this.troll_declare_button.style.opacity = 0.4;\n    } else if (args.side == 't') {\n      this.troll_side.style.opacity = 1;\n      this.dwarf_side.style.opacity = 0.6;\n      this.troll_declare_button.style.opacity = 1;\n      this.dwarf_declare_button.style.opacity = 0.4;\n    }\n    this.draw_board();\n  }\n\n  // The player is thinking about moving from this space\n  // In the UI, this is a mouse hover, before a space is selected.\n  // args.x\n  // args.y\n  highlight_space(args) {\n    var reporter = this;\n    reporter.draw_board();\n    reporter.outline_space({x: args.x, y: args.y}, 'lightgreen');\n    args.moves.forEach(\n      move => reporter.outline_space(move, Canvas.move_colours[move.type])\n    );\n  }\n\n  // The player has decided to move this piece.\n  // In the UI, this is a click.\n  // args.x\n  // args.y\n  select_space(args) {\n    var reporter = this;\n    reporter.draw_board();\n    reporter.highlight_space(reporter.game.current_client().current_space);\n  }\n\n  // The player is thinking of moving the piece from the selected space to this one.\n  // In the UI, it's a mouse hover.\n  // args.x\n  // args.y\n  // args.type\n  highlight_move(args) {\n    var reporter = this;\n    reporter.draw_board();\n    reporter.highlight_space(reporter.game.current_client().controller.checked_space);\n    reporter.heavy_outline_space(\n      {x: args.x, y: args.y},\n      Canvas.move_colours[args.type]\n    );\n\n    if (args.targets) {\n      args.targets.forEach(target => {\n        reporter.outline_space(target, 'red')\n      })\n    }\n  }\n\n  // The player makes a move.\n  // In the UI, it's a click when a space is selected.\n  // args.side\n  // args.from.x\n  // args.from.y\n  // args.to.x\n  // args.to.y\n  move(args) {\n  }\n\n  // A piece has taken another piece (takes place after a move)\n  // args.x\n  // args.y\n  // args.side\n  piece_taken(args) {\n    var reporter = this;\n\n    function draw_marker(alpha) {\n      reporter.overlay_context.beginPath();\n      reporter.overlay_context.arc(\n        (Canvas.space_size * args.x) + (Canvas.space_size / 2),\n        Canvas.space_size * args.y + (Canvas.space_size / 2),\n        (Canvas.space_size / 2) * 0.8,\n        0,\n        2 * Math.PI);\n      reporter.overlay_context.fillStyle = `rgba(255,0,0,${alpha})`;\n      reporter.overlay_context.fill();\n    }\n\n    function clear_square() {\n      reporter.overlay_context.clearRect(\n        Canvas.space_size * args.x,\n        Canvas.space_size * args.y,\n        Canvas.space_size,\n        Canvas.space_size\n      );\n    }\n\n    var alpha = 1;\n    var delta = 0.02;\n    draw_marker(alpha);\n\n    function fade() {\n      alpha -= delta;\n      clear_square();\n      draw_marker(alpha);\n      if (alpha >= 0) {\n        requestAnimationFrame(fade);\n      }\n    }\n\n    fade();\n  }\n\n  // Someone's earned some points\n  // game.get_score()\n  score(args) {\n    var score = this.game.get_score();\n    switch (score.winning) {\n      case 'd':\n        this.centre.classList.remove('troll');\n        this.centre.classList.add('dwarf');\n        break;\n      case 't':\n        this.centre.classList.remove('dwarf');\n        this.centre.classList.add('troll');\n        break;\n      case '?':\n        this.centre.classList.remove('dwarf');\n        this.centre.classList.remove('troll');\n    }\n    this.dwarf_side.innerHTML = `${this.game.dwarves.length} dwarves: ${score.dwarves}`;\n    this.troll_side.innerHTML = `${this.game.trolls.length} trolls: ${score.trolls}`;\n    this.centre.innerHTML = score.difference;\n  }\n\n  // A player has declared that the game is over (or retracted that declaration\n  // args.side\n  // args.game_over\n  player_declared(args) {\n    var button;\n    if (args.side == 'd') {\n      button = this.dwarf_declare_button;\n    } else if (args.side == 't') {\n      button = this.troll_declare_button;\n    }\n    if(args.game_over) {\n      button.innerHTML = 'Make War';\n    } else {\n      button.innerHTML = 'Make Peace';\n    }\n  }\n\n  // The game's over, awww.\n  // args.reason\n  // this.game.get_score()\n  game_ended(args) {\n    var score = this.game.get_score();\n    var score_messages = {\n      d: `Dwarves win by ${score.difference} points`,\n      t: `Trolls win by ${score.difference} points`,\n      '?': 'Nobody wins'\n    }\n    this.overlay_context.font = '45px Arial';\n    if (score.winning == 'd') {\n      this.overlay_context.fillStyle = 'blue';\n      this.overlay_context.strokeStyle = 'white';\n    } else if (score.winning == 't') {\n      this.overlay_context.fillStyle = 'green';\n      this.overlay_context.strokeStyle = 'white';\n    } else {\n      this.overlay_context.fillStyle = 'white';\n      this.overlay_context.strokeStyle = 'black';\n    }\n    this.overlay_context.textBaseline = 'middle';\n    this.overlay_context.textAlign = 'center';\n    this.end_text_line('Game Over!', 5);\n    this.end_text_line(args.reason, 7.5);\n    this.end_text_line(score_messages[score.winning], 10);\n  }\n\n  end_text_line(message, y) {\n    this.overlay_context.fillText(\n      message,\n      (Canvas.space_size * 7.5),\n      (Canvas.space_size * y)\n    );\n    this.overlay_context.strokeText(\n      message,\n      (Canvas.space_size * 7.5),\n      (Canvas.space_size * y)\n    );\n  }\n\n}\n\nmodule.exports = Canvas;\n\n\n//# sourceURL=webpack://Thud/./src/reporters/canvas.js?");

/***/ }),

/***/ "./src/reporters/console.js":
/*!**********************************!*\
  !*** ./src/reporters/console.js ***!
  \**********************************/
/***/ ((module) => {

eval("class Console {\n  constructor(game) {\n    this.game = game;\n    this.board = game.board;\n  }\n\n  // Reports the current state of the board\n  // this.board.spaces\n  board_state({}) {\n    // ignored\n  }\n\n  // It's the start of a player's turn\n  // args.side\n  // args.turn\n  turn_starts(args) {\n    console.log(`Turn ${args.turn} starts: ${this.get_side(args.side)} to move`);\n  }\n\n  // The player is thinking about moving from this space\n  // In the UI, this is a mouse hover, before a space is selected.\n  // args.x\n  // args.y\n  highlight_space(args) {\n    // ignored\n  }\n\n  // The player has decided to move this piece.\n  // In the UI, this is a click.\n  // args.x\n  // args.y\n  select_space(args) {\n    //ignored\n  }\n\n  // The player is thinking of moving the piece from the selected space to this one.\n  // In the UI, it's a mouse hover.\n  // args.x\n  // args.y\n  highlight_move(args) {\n    // ignored\n  }\n\n  // The player makes a move.\n  // In the UI, it's a click when a space is selected.\n  // args.side\n  // args.from.x\n  // args.from.y\n  // args.to.x\n  // args.to.y\n  move(args) {\n    console.log(`${this.get_side(args.side)} moves from ${args.from.x}:${args.from.y} to ${args.to.x}:${args.to.y}`);\n  }\n\n  // A piece has taken another piece (takes place after a move)\n  // args.x\n  // args.y\n  // args.side\n  piece_taken(args) {\n    console.log(`${this.get_side(args.side)} taken at ${args.x}:${args.y}`);\n  }\n\n  // Someone's earned soem points\n  // this.game.get_score()\n  score(args) {\n    var score = this.game.get_score();\n    console.log(`The score is now dwarves: ${score.dwarves}, trolls: ${score.trolls}... ${this.get_side(score.winning)} are winning by ${score.difference}`);\n  }\n\n  // A player has declared that the game is over (or retracted that declaration\n  // args.side\n  // args.game_over\n  player_declared(args) {\n    console.log(`${this.get_side(args.side)} declared that the game ${args.game_over ? 'is' : 'is not'} over`);\n  }\n\n  // The game's over, awww.\n  // args.reason\n  // this.game.get_score()\n  game_ended(args) {\n    var score = this.game.get_score();\n    console.log(`Game over! ${args.reason}! ${this.get_side(score.side)} wins by ${score.difference}`);\n  }\n\n  get_side(side) {\n    if (side == 'd') {\n      return 'dwarves'\n    } else if (side == 't') {\n      return 'trolls'\n    } else {\n      return 'nobody'\n    }\n  }\n\n}\n\nmodule.exports = Console;\n\n//# sourceURL=webpack://Thud/./src/reporters/console.js?");

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