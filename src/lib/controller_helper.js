const MoveCalculator = require('./move_calculator.js');
const Utils = require('./utils.js');

class ControllerHelper {

  constructor(controller, game) {
    this.controller = controller;
    this.side = controller.side;
    this.game = game;
  }

  board() {
    return this.game.board;
  }

  space_proxy(space) {
    if (space) {
      var piece
      if (space.piece) {
        piece = space.piece.type
      } else {
        piece = null
      }
      return {
        x: space.x,
        y: space.y,
        piece: piece
      }
    } else {
      return null;
    }
  }

  moves_for(space) {
    var move_calculator = new MoveCalculator(this.board(), space, this.game.current_side);
    this.controller.checked_space = {
      x: space.x,
      y: space.y,
      moves: move_calculator.moves
    };
    return move_calculator.moves;
  }

  // Troll in this space kills all adjacent dwarves
  troll_swing(x, y) {
    var space = this.board().space(x, y);
    var nearby_dwarves = space.neighbours.filter(neighbour => neighbour.piece && neighbour.piece.type == 'd');
    nearby_dwarves.forEach(dwarf => {
      this.game.report('piece_taken', Object.assign(dwarf, {side: 'd'}));
      this.game.remove_piece(dwarf);
    });
  }

  space_info(x, y) {
    var space = this.board().space(x, y);
    space = this.space_proxy(space);
    var move_calculator = new MoveCalculator(this.board(), space, space.piece);
    space.moves = move_calculator.moves;
    space.nearest_dwarf = this.nearest(x, y, 'd');
    space.nearest_troll = this.nearest(x, y, 't');
    return space;
  }

  nearest(x, y, side) {
    var helper = this;
    var distance = 0;
    var found_pieces = [];
    do {
      distance += 1;
      var box = Utils.distance_box(x, y, distance);
      found_pieces = box.filter(coord => {
        var space = helper.board().space(coord.x, coord.y)
        return space && space.piece && space.piece.type == side;
      });
    } while (found_pieces.length == 0 && distance < 15);
    return {
      distance: distance,
      pieces: found_pieces
    }
  }

}

module.exports = ControllerHelper;
