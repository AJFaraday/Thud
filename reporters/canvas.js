if (typeof Reporters == 'undefined') {
  Reporters = {}
}

Reporters['Canvas'] = class Canvas {

  static space_colours = ['lightgrey', 'darkgrey']
  static space_size = 30;

  constructor(game) {
    var reporter = this;
    reporter.game = game;
    reporter.board = game.board;
    reporter.canvas = Utils.build_element(
      'canvas',
      {
        height: Reporters.Canvas.space_size * 15,
        width: Reporters.Canvas.space_size * 15,
        style: 'background-color: white;'
      }
    );
    reporter.context = reporter.canvas.getContext('2d');
    document.getElementById('thud_board').append(reporter.canvas);
    reporter.draw_board();
  }

  draw_board() {
    var reporter = this;
    reporter.clear_canvas();
    reporter.board.rows.forEach(
      function (row, row_index) {
        row.forEach(
          function (space, column_index) {
            reporter.draw_space(space, reporter);
          }
        )
      }
    );
    reporter.game.dwarves.forEach(
      function(dwarf) {
        reporter.draw_peice(dwarf, 'blue');
      }
    );
    reporter.game.trolls.forEach(
      function(dwarf) {
        reporter.draw_peice(dwarf, 'green');
      }
    );
  }

  clear_canvas() {
    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  draw_space(space) {
    if (space) {
      this.context.fillStyle = Reporters.Canvas.space_colours[space.colour_index];
      this.context.fillRect(
        Reporters.Canvas.space_size * space.x,
        Reporters.Canvas.space_size * space.y,
        Reporters.Canvas.space_size,
        Reporters.Canvas.space_size
      );
    }
  }

  outline_space(space, colour) {
    if (space) {
      this.context.strokeStyle = colour;
      this.context.strokeRect(
        Reporters.Canvas.space_size * space.x,
        Reporters.Canvas.space_size * space.y,
        Reporters.Canvas.space_size,
        Reporters.Canvas.space_size
      );
    }
  }

  draw_peice(space, colour) {
    this.context.beginPath();
    this.context.arc(
      (Reporters.Canvas.space_size * space.x) + (Reporters.Canvas.space_size / 2),
      Reporters.Canvas.space_size * space.y + (Reporters.Canvas.space_size / 2),
      (Reporters.Canvas.space_size / 2) * 0.8,
      0,
      2 * Math.PI);
    this.context.fillStyle = colour;
    this.context.fill();
  }

  // Main interface:

  // Reports the current state of the board
  // this.board.spaces
  board_state(attrs) {
    this.draw_board();
  }

  // It's the start of a player's turn
  // attrs.side
  turn_starts(args) {

  }

  // The player is thinking about moving from this space
  // In the UI, this is a mouse hover, before a space is selected.
  // args.x
  // args.y
  highlight_space(args) {
    this.outline_space(this.board.space(args.x, args.y), 'yellow');
    // TODO and the rest!
  }

  // The player has decided to move this piece.
  // In the UI, this is a click.
  // args.x
  // args.y
  select_space(args) {

  }

  // The player is thinking of moving the piece from the selected space to this one.
  // In the UI, it's a mouse hover.
  // args.x
  // args.y
  highlight_move(args) {

  }

  // The player makes a move.
  // In the UI, it's a click when a space is selected.
  // args.x
  // args.y
  move(args) {

  }

  // A piece has taken another piece (takes place after a move)
  // args.taken.x
  // args.taken.y
  // args.by.x
  // args.by.y
  piece_taken(args) {

  }

  // Someone's earned soem points
  // args.side
  // this.board.scores[args.side]
  score_changed(args) {

  }

  // The game's over, awww.
  //args.reason
  game_ended(args) {

  }

};
