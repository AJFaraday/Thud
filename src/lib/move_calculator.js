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
    var shoves = MoveCalculator.get_all_shoves(this.board.game);
    Object.values(calculator.space.directions).forEach(
      direction => {
        direction.empty_spaces().forEach(empty_space => moves.push({
          x: empty_space.x,
          y: empty_space.y,
          type: 'walk',
          kills: 0,
          in_danger: MoveCalculator.in_danger_from_trolls(empty_space, shoves, this.space.game)
        }));
        MoveCalculator.get_hurls(direction).forEach(hurl => {
          moves.push({
            x: hurl.x,
            y: hurl.y,
            type: 'hurl',
            kills: 1,
            in_danger: MoveCalculator.in_danger_from_trolls(hurl, shoves, this.space.game)
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
        if (((hypothetical && index >= 1) || space.is_troll()) && MoveCalculator.space_between_is_empty(direction, (index - 1))) {
          hurls.push(space);
        }
      }
    )
    return hurls;
  }

  static in_danger_from_trolls(space, shoves, game) {
    var in_danger = false;
    game.trolls.forEach(troll => {
      var distance = Utils.distance_between(space, troll);
      if (!in_danger && distance >= 1 && distance <= 2) {
        in_danger = true;
      }
    });
    shoves.forEach(shove => {
      var distance = Utils.distance_between(space, shove);
      if (!in_danger && distance == 1) {
        in_danger = true;
      }
    });
    return in_danger;
  }

  troll_moves() {
    var calculator = this;
    var moves = [];
    var hurls = MoveCalculator.get_all_hurls(this.board.game);
    calculator.space.neighbours.filter(
      neighbour => neighbour.is_empty()
    ).forEach(
      neighbour => {
        var kills = neighbour.neighbours_of_type('d');
        moves.push(
          {
            x: neighbour.x,
            y: neighbour.y,
            type: 'walk',
            kills: kills,
            in_danger: MoveCalculator.in_danger_from_dwarfs(neighbour, hurls)
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
            in_danger: MoveCalculator.in_danger_from_dwarfs(shove, hurls)
          }
        );
      });
    });
    return moves;
  }

  static in_danger_from_dwarfs(space, hurls) {
    var in_danger = false;
    hurls.forEach(hurl => {
      if (!in_danger && Utils.distance_between(space, hurl) == 0) {
        in_danger = true;
      }
    });
    return in_danger;
  }

  static get_all_hurls(game) {
    var all_hurls = [];
    game.dwarfs.forEach(dwarf => {
      var space = game.board.space(dwarf.x, dwarf.y);
      Object.values(space.directions).forEach(direction => {
        all_hurls.push(MoveCalculator.get_hurls(direction, true))
      });
    });
    return all_hurls.flat();
  }

  static get_all_shoves(game) {
    var all_shoves = [];
    game.trolls.forEach(troll => {
      var space = game.board.space(troll.x, troll.y);
      Object.values(space.directions).forEach(direction => {
        all_shoves.push(MoveCalculator.get_shoves(direction, true))
      });
    });
    return all_shoves.flat();
  }

  static get_shoves(direction, hypothetical = false) {
    var shoves = [];
    var shove_distance = direction.opposite.pieces_in_line('t');
    direction.spaces.slice(2, shove_distance + 1).forEach(
      (space, index) => {
        if (
          space.is_empty() &&
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
    return direction.spaces.slice(1, (index + 2)).every(space => space.is_empty());
  }

  static space_has_dwarf_neighours(space) {
    return space.neighbours_of_type('d') > 0;
  }
}

module.exports = MoveCalculator;