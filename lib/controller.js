class Controller {
  constructor(game, side) {
    this.game = game;
    this.side = side;
  }

  turn() {
    var controller = this;
    return this.wrapper(function (args) {
      return controller.game.turn;
    });
  }

  scores() {
    var controller = this;
    return this.wrapper(function (args) {
      return Object.assign(controller.game.scores);
    });
  }

  previous_move() {
    var controller = this;
    return this.wrapper(function (args) {
      return Object.assign(controller.game.previous_move);
    });
  }

  spaces() {
    var controller = this;
    return this.wrapper(function (args) {
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
    return this.wrapper(function (args) {
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
    return this.wrapper(function (args) {
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
      function() {
        var space = controller.game.board.space(x,y);
        controller.game.report('highlight_space', {x: x, y: y});
        // TODO direction calculator classes plugged in here
        return space;
      }
    )
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

  wrapper(func, args) {
    if (game.current_side == this.side) {
      return func(args);
    } else {
      return null;
    }
  }
}