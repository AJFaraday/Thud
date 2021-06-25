const Utils = require('./utils.js');
const Space = require('../models/space.js');

class MoveCalculator {

  constructor(board, space, side) {
    this.board = board;
    this.side = side;
    // game is set for Space, but not space_proxy
    this.space = ((space instanceof Space) ? space : this.board.space(space.x, space.y));
    if (this.space && this.space.piece && this.space.piece.type == side) {
      if (side == 'd') {
        this.moves = this.dwarf_moves();
      } else if (side == 't') {
        this.moves = this.troll_moves();
      } else {
        this.moves = [];
      }
      this.safe_moves = this.moves.filter(move => !move.in_danger)
    } else {
      this.moves = [];
      this.safe_moves = [];
    }
  }

  dwarf_moves() {
    var calculator = this;
    var moves = [];
    var shoves = this.get_all_shoves()
    Object.values(calculator.space.directions).forEach(
      direction => {
        direction.empty_spaces().forEach(empty_space => moves.push({
          x: empty_space.x,
          y: empty_space.y,
          type: 'walk',
          kills: 0,
          in_danger: calculator.in_danger_from_trolls(empty_space, shoves)
        }));
        MoveCalculator.get_hurls(direction).forEach(hurl => {
          moves.push({
            x: hurl.x,
            y: hurl.y,
            type: 'hurl',
            kills: 1,
            in_danger: this.in_danger_from_trolls(hurl, shoves)
          });
        });
      }
    );

    return moves;
  }

  static get_hurls(direction, hypothetical = false) {
    var hurl_distance = direction.opposite.pieces_in_line('d');
    var hurls = [];
    direction.spaces.slice(1, (hurl_distance + 1)).forEach(
      (space, index) => {
        if ((hypothetical || space.is_troll()) && MoveCalculator.space_between_is_empty(direction, index)) {
          hurls.push(space);
        }
      }
    )
    return hurls;
  }

  in_danger_from_trolls(space, shoves) {
    var in_danger = false;
    this.space.game.trolls.forEach(troll => {
      if (!in_danger && Utils.distance_between(space, troll) <= 2) {
        in_danger = true;
      }
    });
    shoves.forEach(shove => {
      if (!in_danger && Utils.distance_between(space, shove) <= 1) {
        in_danger = true;
      }
    });
    return in_danger;
  }

  troll_moves() {
    var calculator = this;
    var moves = [];
    var hurls = this.get_all_hurls();
    calculator.space.neighbours.filter(
      neighbour => !neighbour.piece
    ).forEach(
      neighbour => {
        var kills = neighbour.neighbours_of_type('d');
        moves.push(
          {
            x: neighbour.x,
            y: neighbour.y,
            type: 'walk',
            kills: kills,
            in_danger: calculator.in_danger_from_dwarves(neighbour, hurls)
          }
        );
      }
    );
    calculator.space.neighbours.filter(
      neighbour => (neighbour.is_dwarf())
    ).forEach(
      neighbour => {
        var kills = neighbour.neighbours_of_type('d');
        moves.push(
          {
            x: neighbour.x,
            y: neighbour.y,
            type: 'take',
            kills: kills,
            in_danger: calculator.in_danger_from_dwarves(neighbour, hurls)
          }
        );
      }
    );

    Object.values(calculator.space.directions).forEach((direction) => {
      MoveCalculator.get_shoves(direction).forEach((shove) => {
        var kills = shove.neighbours_of_type('d');
        if (shove.is_dwarf()) {
          kills += 1;
        }
        moves.push(
          {
            x: shove.x,
            y: shove.y,
            type: 'shove',
            kills: kills,
            in_danger: calculator.in_danger_from_dwarves(shove, hurls)
          }
        );
      });
    });
    return moves;
  }

  in_danger_from_dwarves(space, hurls) {
    var in_danger = false;
    this.space.game.dwarves.forEach(dwarf => {
      if (Utils.distance_between(space, dwarf) <= 1) {
        in_danger = true;
      }
    });
    hurls.forEach(hurl => {
      if (!in_danger && Utils.distance_between(space, hurl) == 0) {
        in_danger = true;
      }
    });
    return in_danger;
  }

  get_all_hurls() {
    this.all_hurls = [];
    this.board.game.dwarves.forEach(dwarf => {
      var space = this.board.space(dwarf.x, dwarf.y);
      Object.values(space.directions).forEach(direction => {
        this.all_hurls.push(MoveCalculator.get_hurls(direction, true))
      });
    });
    return this.all_hurls.flat();
  }

  get_all_shoves() {
    this.all_shoves = [];
    this.board.game.trolls.forEach(troll => {
      var space = this.board.space(troll.x, troll.y);
      Object.values(space.directions).forEach(direction => {
        this.all_shoves.push(MoveCalculator.get_shoves(direction, true))
      });
    });
    return this.all_shoves.flat();
  }

  static get_shoves(direction, hypothetical = false) {
    var shoves = [];
    var shove_distance = direction.opposite.pieces_in_line('t');
    direction.spaces.slice(2, shove_distance + 1).forEach(
      (space, index) => {
        if (
          space.is_dwarf() ||
          (
            MoveCalculator.space_between_is_empty(direction, index) &&
            (hypothetical || MoveCalculator.space_has_dwarf_neighours(space))
          )
        ) {
          shoves.push(space);
        }
      }
    );
    return shoves;
  }

  static space_between_is_empty(direction, index) {
    return direction.spaces.slice(1, (index + 1)).every(space => !space.peice);
  }

  static space_has_dwarf_neighours(space) {
    return space.neighbours_of_type('d') > 0;
  }
}

module.exports = MoveCalculator;