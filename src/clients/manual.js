const Utils = require('./../lib/utils.js');
const Reporters = require('./../reporters.js');

// This is strongly coupled with Reporters.Canvas
class Manual {
  constructor(game, controller) {
    this.game = game;
    this.controller = controller;
    this.side = controller.side;

    this.canvas = document.querySelector("#thud_board canvas");
  }

  turn() {
    Utils.addListener(this.canvas, 'mousemove', e => this.mouseover(e), false);
    Utils.addListener(this.canvas, 'mouseup', e => this.mouseup(e), false);
    Utils.addListener(this.canvas, 'contextmenu', e => this.debug_space(e), false);
    Utils.addListener(this.declare_button(), 'mouseup', e => this.declare(), false);
  }

  end_turn() {
    Utils.removeAllListeners(this.canvas, 'mousemove');
    Utils.removeAllListeners(this.canvas, 'mouseup');
    Utils.removeAllListeners(this.canvas, 'contextmenu');
    Utils.removeAllListeners(this.declare_button(), 'mouseup');
  }


  mouseover(event) {
    var space = this.space_at(event.offsetX, event.offsetY);
    if (space) {
      if (this.controller.current_space) {
        this.controller.check_move(space.x, space.y);
      } else {
        this.controller.check_space(space.x, space.y);
      }
    }
  }

  mouseup(event) {
    var space = this.space_at(event.offsetX, event.offsetY);
    if (space) {
      if (this.controller.current_space) {
        this.controller.move(space.x, space.y);
      } else {
        this.controller.select_space(space.x, space.y);
      }
    }
  }

  debug_space(event) {
    event.preventDefault();
    var space = this.space_at(event.offsetX, event.offsetY);
    if (space.piece) {
      console.log(space.piece)
    } else {
      console.log(space)
    }
    var dist = this.game.dwarf_controller.space_info(space.x, space.y).nearest_troll.distance
    var box = Utils.distance_box(space.x, space.y, dist)
    box.forEach(
      (coord) => {
        this.game.reporters[0].outline_space({x: coord[0], y: coord[1]}, 'green')
      }
    );
    var dist = this.game.dwarf_controller.space_info(space.x, space.y).nearest_dwarf.distance
    var box = Utils.distance_box(space.x, space.y, dist)
    box.forEach(
      (coord) => {
        this.game.reporters[0].outline_space({x: coord[0], y: coord[1]}, 'blue')
      }
    );
  }

  space_at(x, y) {
    return this.game.board.space(
      Math.floor(x / Reporters.Canvas.space_size),
      Math.floor(y / Reporters.Canvas.space_size)
    );
  }

  declare_button() {
    if (this.side == 'd') {
      return document.getElementById('dwarf_declare_button');
    } else if (this.side == 't') {
      return document.getElementById('troll_declare_button');
    }
  }

  declare() {
    var button = this.declare_button();
    button.dataset.over = button.dataset.over != 'true';
    this.controller.declare(button.dataset.over == 'true');
  }

}

module.exports = Manual;
