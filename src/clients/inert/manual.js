const Utils = require('./../../lib/utils.js');
const Reporters = require('./../../reporters.js');

// This is strongly coupled with Reporters.Canvas
class Manual {
  constructor(controller) {
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
      space.moves.forEach(
        move => game.reporters[0].outline_space(move, Reporters.Canvas.move_colours[move.type])
      );
    } else {
      console.log(space)
    }
    game.current_controller().space_info(space.x, space.y).nearest_troll.pieces.forEach(
      (coord) => {
        game.reporters[0].outline_space(coord, 'green')
      }
    );
    game.current_controller().space_info(space.x, space.y).nearest_dwarf.pieces.forEach(
      (coord) => {
        game.reporters[0].outline_space(coord, 'blue')
      }
    );
  }

  space_at(x, y) {
    return this.controller.space_info(
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
