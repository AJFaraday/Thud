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
    //var move_calculator = new MoveCalculator(this.board(), space, this.game.current_side);
    var space_info = this.controller.space_info(space.x, space.y)
    this.controller.checked_space = {
      x: space.x,
      y: space.y,
      moves: space_info.moves,
      in_danger: space_info.in_danger
    };
    return space_info.moves;
  }

  // Troll in this space kills all adjacent dwarfs
  troll_swing(x, y) {
    var space = this.board().space(x, y);
    var nearby_dwarfs = space.neighbours.filter(neighbour => neighbour.is_dwarf());
    nearby_dwarfs.forEach(dwarf => {
      this.game.report('piece_taken', Object.assign(dwarf, {side: 'd'}));
      this.game.remove_piece(dwarf);
    });
  }

  space_info(x, y) {
    var space = this.board().space(x, y);
    if (space) {
      space = this.space_proxy(space);
      var move_calculator = new MoveCalculator(this.board(), space, space.piece);
      space.moves = move_calculator.moves;
      space.safe_moves = move_calculator.safe_moves;
      space.nearest_dwarf = this.nearest(x, y, 'd');
      space.nearest_troll = this.nearest(x, y, 't');
      if (this.side == 't') {
        space.in_danger = MoveCalculator.in_danger_from_dwarfs(space, MoveCalculator.get_all_hurls(this.game))
      } else if (this.side == 'd') {
        space.in_danger = MoveCalculator.in_danger_from_trolls(space, MoveCalculator.get_all_shoves(this.game), this.game)
      } else {
        space.in_danger = false;
      }
      return space;
    } else {
      return null;
    }
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
