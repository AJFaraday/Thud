const ControllerHelper = require('./controller_helper.js');

class Controller {

  constructor(game, side) {
    this.game = game;
    this.side = side;
    this.current_space = null;
    this.helper = new ControllerHelper(this, game);
    this.turn_cache = {turn: 0};
  }

  turn() {
    var controller = this;
    return this.wrapper(() => {
      return controller.game.turn_number;
    });
  }

  scores() {
    var controller = this;
    return controller.game.get_score();
  }

  spaces() {
    var controller = this;
    return Array.from(
      controller.game.board.spaces,
      space => controller.helper.space_proxy(space)
    );
  }

  space_info(x, y) {
    var controller = this;
    return controller.helper.space_info(x, y);
  }

  pieces() {
    if (this.side == 'd') {
      return this.dwarfs();
    } else if (this.side == 't') {
      return this.trolls();
    }
  }

  dwarfs() {
    var controller = this;
    return Array.from(
      controller.game.dwarfs,
      dwarf => ({x: dwarf.x, y: dwarf.y})
    );
  }

  trolls() {
    var controller = this;
    return Array.from(
      controller.game.trolls,
      troll => ({x: troll.x, y: troll.y})
    );
  }

  indexed_dwarfs() {
    var controller = this;
    return Array.from(
      controller.game.indexed_dwarfs,
      dwarf => (dwarf ? {x: dwarf.x, y: dwarf.y} : null)
    );
  }

  indexed_trolls() {
    var controller = this;
    return Array.from(
      controller.game.indexed_trolls,
      troll => (troll ? {x: troll.x, y: troll.y} : null)
    );
  }

  previous_move() {
    var controller = this;
    return Object.assign(controller.game.previous_move);
  }

  killing_moves() {
    var killing_moves = [];
    this.pieces().forEach((piece) => {
      var space_info = this.space_info(piece.x, piece.y);
      space_info.moves.forEach((move) => {
        if (move.kills > 0) {
          killing_moves.push({
            from: {x: piece.x, y: piece.y},
            to: {x: move.x, y: move.y},
            kills: move.kills
          });
        }
      });
    });
    return killing_moves.flat();
  }

// Actual actions
  check_space(x, y) {
    var controller = this;
    return controller.wrapper(
      () => {
        var space = controller.game.board.space(x, y);
        if(space.piece && space.piece.type == this.side) {
          // Sets checked_space
          controller.helper.moves_for(space);
          controller.game.report('highlight_space', controller.checked_space);
          return controller.space_info(x, y);
        } else {
          return null;
        }
      }
    );
  }

  select_space(x, y) {
    var controller = this;
    return controller.wrapper(
      () => {
        var space = controller.helper.space_proxy(controller.game.board.space(x, y));
        if (space) {
          if (!controller.checked_space || controller.checked_space.x != x || controller.checked_space.y != y) {
            controller.helper.moves_for(space);
          }
          if (space.piece && space.piece == controller.side) {
            controller.current_space = space;
            return true;
          } else {
            controller.clear_space();
            return false;
          }
        }
      }
    );
  }

  check_move(x, y) {
    var target_space = this.game.board.space(x, y);
    if (this.current_space && target_space) {
      var moves = this.helper.moves_for(this.current_space);
      var move = moves.find(move => move.x == x && move.y == y);
      if (move) {
        if (this.side == 'd') {
          var kills;
          var targets = [];
          if (move.type == 'hurl') {
            kills = 1;
            targets = [{x: target_space.x, y: target_space.y}]
          } else if (move.type == 'walk') {
            kills = 0;
          }
          move.side = 'd';
          this.game.report('highlight_move', move);
          return {valid: true, type: move.type, kills: kills, targets: targets};
        } else if (this.side == 't') {
          move.side = 't';
          move.targets = target_space.neighbours
            .filter(neighbour => neighbour.is_dwarf())
            .map(dwarf => ({x: dwarf.x, y: dwarf.y}));
          this.game.report('highlight_move', move);
          return {valid: true, type: move.type, kills: move.targets.length, targets: move.targets};
        } else {
          return {valid: false, type: null, kills: 0, targets: []};
        }
      } else {
        return {valid: false, type: null, kills: 0, targets: []};
      }
    }
  }

  move(x, y) {
    var controller = this;
    return controller.wrapper(
      () => {
        var target = controller.checked_space.moves.find(
          space => space.x == x && space.y == y
        );
        if (target) {

          controller.game.move_piece(target.x, target.y, target.type);
          if (this.side == 't') {
            controller.helper.troll_swing(target.x, target.y);
          }
          controller.game.previous_move = {
            from: {x: controller.current_space.x, y: controller.current_space.y},
            to: {x: target.x, y: target.y},
            side: controller.side,
            type: target.type,
            killed: target.kills
          }
          controller.clear_space();
          controller.game.end_turn();
          return true;
        } else {
          controller.clear_space();
          return false;
        }
      }
    );
  }

  clear_space() {
    this.current_space = null;
    this.checked_space = null;
    this.game.report('board_state');
  }

  declare(game_over) {
    this.declared = game_over;
    this.game.report('player_declared', {side: this.side, game_over: game_over});
    /*
    if (this.opponent_declared()) {
      this.game.end_turn();
    }
     */
  }

  opponent_declared() {
    if (this.side == 'd') {
      return this.game.troll_controller.declared;
    } else if (this.side == 't') {
      return this.game.dwarf_controller.declared;
    }
  }


  wrapper(func) {
    if (this.game.current_side == this.side) {
      return func();
    } else {
      return null;
    }
  }

  turn_cached(key, func) {
    if(this.turn_cache.turn != this.turn()) {
      this.turn_cache = {turn: this.turn()};
    }
    if (this.turn_cache[key]) {
      return this.turn_cache[key];
    } else {
      var value = func.call();
      this.turn_cache[key] = value;
      return value;
    }
  }


}

module.exports = Controller;