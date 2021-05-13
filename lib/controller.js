class Controller {
  constructor(game, side) {
    this.game = game;
    this.side = side;
    this.current_space = null;
  }

  turn() {
    var controller = this;
    return this.wrapper(function () {
      return controller.game.turn;
    });
  }

  scores() {
    var controller = this;
    return this.wrapper(function () {
      return Object.assign(controller.game.scores);
    });
  }

  previous_move() {
    var controller = this;
    return this.wrapper(function () {
      return Object.assign(controller.game.previous_move);
    });
  }

  spaces() {
    var controller = this;
    return this.wrapper(function () {
      return Array.from(
        controller.game.board.spaces(),
        function (space) {
          return controller.space_proxy(space);
        }
      );
    });
  }

  dwarves() {
    var controller = this;
    return this.wrapper(function () {
      return Array.from(
        controller.game.dwarves,
        function (dwarf) {
          return {
            x: dwarf.x,
            y: dwarf.y
          }
        }
      );
    });
  }

  trolls() {
    var controller = this;
    return this.wrapper(function () {
      return Array.from(
        controller.game.trolls,
        function (troll) {
          return {
            x: troll.x,
            y: troll.y
          }
        }
      );
    });
  }


  // Actual actions
  check_space(x, y) {
    var controller = this;
    return controller.wrapper(
      function () {
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
      function () {
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
    console.log('TODO check_move');
  }

  move(x, y) {
    var controller = this;
    return controller.wrapper(
      function () {
        var target = controller.checked_space.moves.find(
          function (space) {
            return (space.x == x && space.y == y);
          }
        )
        if (target) {
          controller.move_piece(target.x, target.y);
          controller.clear_space();
          controller.game.end_turn();
        } else {
          controller.clear_space();
        }
      }
    );
  }

  // move current piece (from select_space) to x, y
  move_piece(x,y) {
    var source_space = this.game.board.space(
      this.current_space.x,
      this.current_space.y
    );
    var target_space = this.game.board.space(x, y);
    target_space.piece = source_space.piece;
    source_space.piece = null;
    target_space.piece.x = x;
    target_space.piece.y = y;
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