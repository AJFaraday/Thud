if (typeof Clients == 'undefined') {
  Clients = {}
}

// This is strongly coupled with Reporters.Canvas
Clients['Manual'] = class Manual {
  constructor(game, controller) {
    this.game = game;
    this.controller = controller;
    this.side = controller.side;

    this.canvas = document.querySelector("#thud_board canvas");
  }

  turn() {
    var client = this;
    console.log('turn() from client: ' + this.side);
    Utils.addListener(
      client.canvas,
      'mousemove',
      function (e) {
        client.mouseover(e);
      },
      false
    );
    Utils.addListener(
      client.canvas,
      'mouseup',
      function (e) {
        client.mouseup(e);
      },
      false
    );
    Utils.addListener(
      client.canvas,
      'contextmenu',
      function (e) {
        client.debug_space(e);
      }
    )
  }

  end_turn() {
    Utils.removeAllListeners(this.canvas, 'mousemove');
    Utils.removeAllListeners(this.canvas, 'mouseup');
    Utils.removeAllListeners(this.canvas, 'contextmenu');
    console.log('end_turn() from client: ' + this.side);
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
    } else {
      console.log(space)
    }
  }

  space_at(x, y) {
    return this.game.board.space(
      Math.floor(x / Reporters.Canvas.space_size),
      Math.floor(y / Reporters.Canvas.space_size)
    );
  }

}