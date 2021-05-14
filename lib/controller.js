class Controller {
  constructor(game, side) {
    this.game = game;
    this.side = side;
    this.current_space = null;
  }

  turn() {
    var controller = this;
    return this.wrapper(() => controller.game.turn)
  }

  scores() {
    var controller = this;
    return this.wrapper(() => Object.assign(controller.game.scores));
  }

  previous_move() {
    var controller = this;
    return this.wrapper(() => Object.assign(controller.game.previous_move));
  }

  spaces() {
    var controller = this;
    return this.wrapper(() => {
      return Array.from(
        controller.game.board.spaces(),
        space => controller.space_proxy(space)
      );
    });
  }

  dwarves() {
    var controller = this;
    return this.wrapper(() => {
        return Array.from(
          controller.game.dwarves,
          dwarf => ({x: dwarf.x, y: dwarf.y})
        );
      }
    );
  }

  trolls() {
    var controller = this;
    return this.wrapper(() => {
        return Array.from(
          controller.game.trolls,
          troll => ({x: troll.x, y: troll.y})
        );
      }
    );
  }


// Actual actions
  check_space(x, y) {
    var controller = this;
    return controller.wrapper(
      () => {
        //console.log(controller.side + ' check_space(' + x + ',' + y + ')')
        var space = controller.game.board.space(x, y);
        var moves = controller.get_moves_for(space);
        controller.game.report('highlight_space', controller.checked_space);
        return moves;
      }
    );
  }

  select_space(x, y) {
    var controller = this;
    return controller.wrapper(
      () => {
        var space = controller.space_proxy(controller.game.board.space(x, y));
        if (space) {
          if (!controller.checked_space || controller.checked_space.x != x || controller.checked_space.y != y) {
            controller.get_moves_for(space);
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
      var moves = this.get_moves_for(this.game.board.space(this.current_space.x, this.current_space.y));
      var move = moves.find(move => move.x == x && move.y == y);
      if (move) {
        if (this.side == 'd') {
          var kills;
          var targets;
          if (move.type == 'hurl') {
            kills = 1;
            targets = [{x: target_space.x, y: target_space.y}]
          } else if (move.type == 'walk') {
            kills = 0;
          }
          move.side = 'd';
          this.game.report('highlight_move', move);
          return {valid: true, type: move.type, kills: kills, targets};
        } else if (this.side == 't') {
          move.side = 't';
          move.targets = target_space.neighbours
            .filter(neighbour => neighbour.piece && neighbour.piece.type == 'd')
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
        )
        if (target) {
          controller.move_piece(target.x, target.y);
          if (this.side == 't') {
            controller.take_swing(target.x, target.y);
          }
          controller.clear_space();
          controller.game.end_turn();
        } else {
          controller.clear_space();
        }
      }
    );
  }

// move current piece (from select_space) to x, y
  move_piece(x, y) {
    var source_space = this.game.board.space(
      this.current_space.x,
      this.current_space.y
    );
    var target_space = this.game.board.space(x, y);
    if (target_space.piece) {
      this.game.remove_piece(target_space);
    }
    target_space.piece = source_space.piece;
    source_space.piece = null;
    target_space.piece.x = x;
    target_space.piece.y = y;
  }

  // Troll in this space kills all adjacent dwarves
  take_swing(x, y) {
    var space = this.game.board.space(x, y);
    var nearby_dwarves = space.neighbours.filter(neighbour => neighbour.piece && neighbour.piece.type == 'd');
    nearby_dwarves.forEach(dwarf => this.game.remove_piece(dwarf));
  }

  get_moves_for(space) {
    var move_calculator = new MoveCalculator(this.game.board, space, this.game.current_side);
    this.checked_space = {
      x: space.x,
      y: space.y,
      moves: move_calculator.moves
    };
    return move_calculator.moves;
  }

  clear_space() {
    this.current_space = null;
    this.checked_space = null;
    this.game.report('board_state', {})
  }

// Private?
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

  wrapper(func) {
    if (this.game.current_side == this.side) {
      return func();
    } else {
      return null;
    }
  }
}