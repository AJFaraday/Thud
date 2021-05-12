if (typeof Clients == 'undefined') {
  Clients = {}
}

// This is strongly coupled with Reporters.Canvas
Clients['Manual'] = class Manual {
  constructor(game, controller) {
    this.game = game;
    this.controller = controller;
    this.side = controller.side;

    this.prev_x = 0;
    this.prev_y = 0;
    this.canvas = document.querySelector("#thud_board canvas");
  }

  turn() {
    var client = this;
    console.log('turn() from client: ' + this.side);
    this.canvas.addEventListener(
      'mousemove',
      function(e) {
        client.mouseover(e);
      }
    );
  }

  end_turn() {
    this.canvas.mousemove = null;
    console.log('end_turn() from client: ' + this.side);
  }


  mouseover(event) {
    var space = this.space_at(event.offsetX, event.offsetY);
    if (space) {
      this.controller.check_space(space.x, space.y);
    }
  }

  space_at(x, y) {
    var x = Math.floor(x / Reporters.Canvas.space_size);
    var y = Math.floor(y / Reporters.Canvas.space_size);
    if (x != this.prev_x || y != this.prev_y) {
      this.prev_x = x;
      this.prev_y = y;
      return this.game.board.space(x, y);
    } else {
      return null;
    }
  }

}