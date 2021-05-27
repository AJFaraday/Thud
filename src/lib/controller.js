const ControllerHelper = require('./controller_helper.js');

class Controller {
  #game
  #helper

  constructor(game, side) {
    this.#game = game;
    this.side = side;
    this.current_space = null;
    this.#helper = new ControllerHelper(this, game);
  }

  turn() {
    var controller = this;
    return this.wrapper(() => {
      return controller.#game.turn_number;
    });
  }

  scores() {
    var controller = this;
    return this.wrapper(() => controller.#game.get_score());
  }

  spaces() {
    var controller = this;
    return this.wrapper(() => {
      return Array.from(
        controller.#game.board.spaces,
        space => controller.#helper.space_proxy(space)
      );
    });
  }

  space_info(x, y) {
    var controller = this;
    return this.wrapper(() => {
      return controller.#helper.space_info(x, y);
    });
  }

  dwarves() {
    var controller = this;
    return this.wrapper(() => {
        return Array.from(
          controller.#game.dwarves,
          dwarf => ({x: dwarf.x, y: dwarf.y})
        );
      }
    );
  }

  trolls() {
    var controller = this;
    return this.wrapper(() => {
        return Array.from(
          controller.#game.trolls,
          troll => ({x: troll.x, y: troll.y})
        );
      }
    );
  }

  indexed_dwarves() {
    var controller = this;
    return this.wrapper(() => {
        return Array.from(
          controller.#game.indexed_dwarves,
          dwarf => (dwarf ? {x: dwarf.x, y: dwarf.y} : null)
        );
      }
    );
  }

  indexed_trolls() {
    var controller = this;
    return this.wrapper(() => {
        return Array.from(
          controller.#game.indexed_trolls,
          troll => (troll ? {x: troll.x, y: troll.y} : null)
        );
      }
    );
  }

  previous_move() {
    var controller = this;
    return this.wrapper(() => Object.assign(controller.#game.previous_move));
  }

// Actual actions
  check_space(x, y) {
    var controller = this;
    return controller.wrapper(
      () => {
        var space = controller.#game.board.space(x, y);
        var moves = controller.#helper.moves_for(space);
        controller.#game.report('highlight_space', controller.checked_space);
        return moves;
      }
    );
  }

  select_space(x, y) {
    var controller = this;
    return controller.wrapper(
      () => {
        var space = controller.#helper.space_proxy(controller.#game.board.space(x, y));
        if (space) {
          if (!controller.checked_space || controller.checked_space.x != x || controller.checked_space.y != y) {
            controller.#helper.moves_for(space);
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
    var target_space = this.#game.board.space(x, y);
    if (this.current_space && target_space) {
      var moves = this.#helper.moves_for(this.current_space);
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
          this.#game.report('highlight_move', move);
          return {valid: true, type: move.type, kills: kills, targets: targets};
        } else if (this.side == 't') {
          move.side = 't';
          move.targets = target_space.neighbours
            .filter(neighbour => neighbour.piece && neighbour.piece.type == 'd')
            .map(dwarf => ({x: dwarf.x, y: dwarf.y}));
          this.#game.report('highlight_move', move);
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

          controller.#game.move_piece(target.x, target.y, target.type);
          if (this.side == 't') {
            controller.#helper.troll_swing(target.x, target.y);
          }
          controller.#game.previous_move = {
            from: {x: controller.current_space.x, y: controller.current_space.y},
            to: {x: target.x, y: target.y},
            side: controller.side,
            type: target.type,
            killed: target.kills
          }
          controller.clear_space();
          controller.#game.end_turn();
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
    this.#game.report('board_state');
  }

  declare(game_over) {
    this.declared = game_over;
    this.#game.report('player_declared', {side: this.side, game_over: game_over});
    if(this.opponent_declared()) {
      this.#game.end_turn();
    }
  }

  opponent_declared() {
    if (this.side == 'd') {
      return this.#game.troll_controller.declared;
    } else if (this.side == 't') {
      return this.#game.dwarf_controller.declared;
    }
  }


  wrapper(func) {
    if (this.#game.current_side == this.side) {
      return func();
    } else {
      return null;
    }
  }
}

module.exports = Controller;