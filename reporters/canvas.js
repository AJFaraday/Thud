if (typeof Reporters == 'undefined') {
  Reporters = {}
}

Reporters['Canvas'] = class Canvas {

  static space_colours = ['lightgrey', 'darkgrey']
  static space_size = 40;
  static move_colours = {
    walk: 'yellow',
    hurl: 'red',
    take: 'red',
    shove: 'orange'
  }

  constructor(game) {
    var reporter = this;
    reporter.game = game;
    reporter.board = game.board;
    document.getElementById('thud').style['width'] = `${Reporters.Canvas.space_size * 15}px`
    this.build_overlay_canvas();
    this.build_canvas();
    this.build_dashboard()
    reporter.draw_board();
  }

  build_canvas() {
    this.canvas = Utils.build_element(
      'canvas',
      {
        height: Reporters.Canvas.space_size * 15,
        width: Reporters.Canvas.space_size * 15,
        class: 'thud_canvas'
      },
      {
        'background-color': 'black',
        'z-index': 0
      }
    )
    ;
    this.context = this.canvas.getContext('2d');
    document.getElementById('thud_board').append(this.canvas);
  }

  build_overlay_canvas() {
    this.overlay_canvas = Utils.build_element(
      'canvas',
      {
        height: Reporters.Canvas.space_size * 15,
        width: Reporters.Canvas.space_size * 15,
        class: 'thud_canvas'
      },
      {
        'z-index': 1
      }
    );
    this.overlay_context = this.overlay_canvas.getContext('2d');
    document.getElementById('thud_board').append(this.overlay_canvas);
  }

  build_dashboard() {
    this.dashboard = document.getElementById('thud_dashboard');
    this.dwarf_side = this.build_side('blue', 'Dwarves');
    this.centre = this.build_centre();
    this.troll_side = this.build_side('green', 'Trolls');
    this.dashboard.append(this.dwarf_side);
    this.dashboard.append(this.centre);
    this.dashboard.append(this.troll_side);
  }

  build_side(colour, title) {
    var side = Utils.build_element(
      'div',
      {class: 'dashboard_panel'},
      {
        'background-color': colour,
        opacity: 0.7,
        width: `${(Reporters.Canvas.space_size * 6) - 5}px`
      }
    );
    side.innerHTML = title
    return side;
  }

  build_centre() {
    return Utils.build_element(
      'div',
      {class: 'dashboard_centre'},
      {
        width: `${Reporters.Canvas.space_size * 3}px`,
      }
    );
  }

  draw_board() {
    var reporter = this;
    reporter.clear_canvas();
    reporter.board.rows.forEach(
      row => row.forEach(space => reporter.draw_space(space, reporter))
    );
    reporter.game.dwarves.forEach(dwarf => reporter.draw_peice(dwarf, 'blue'));
    reporter.game.trolls.forEach(troll => reporter.draw_peice(troll, 'green'));
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
      this.context.lineWidth = 3;
      this.context.strokeRect(
        Reporters.Canvas.space_size * space.x,
        Reporters.Canvas.space_size * space.y,
        Reporters.Canvas.space_size,
        Reporters.Canvas.space_size
      );
    }
  }

  heavy_outline_space(space, colour) {
    if (space) {
      this.context.strokeStyle = colour;
      this.context.lineWidth = 5;
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
  board_state(args) {
    this.draw_board();
  }

  // It's the start of a player's turn
  // args.side
  turn_starts(args) {
    if (args.side == 'd') {
      this.dwarf_side.style.opacity = 1;
      this.troll_side.style.opacity = 0.6;
    } else if (args.side == 't') {
      this.troll_side.style.opacity = 1;
      this.dwarf_side.style.opacity = 0.6;
    }
    this.draw_board();
  }

  // The player is thinking about moving from this space
  // In the UI, this is a mouse hover, before a space is selected.
  // args.x
  // args.y
  highlight_space(args) {
    var reporter = this;
    reporter.draw_board();
    reporter.outline_space({x: args.x, y: args.y}, 'lightgreen');
    args.moves.forEach(
      move => reporter.outline_space(move, Reporters.Canvas.move_colours[move.type])
    );
  }

  // The player has decided to move this piece.
  // In the UI, this is a click.
  // args.x
  // args.y
  select_space(args) {
    var reporter = this;
    reporter.draw_board();
    reporter.highlight_space(reporter.game.current_client().current_space);
  }

  // The player is thinking of moving the piece from the selected space to this one.
  // In the UI, it's a mouse hover.
  // args.x
  // args.y
  // args.type
  // args.side
  // args.targets [{x: 5, y, 9}, ...]
  highlight_move(args) {
    var reporter = this;
    reporter.draw_board();
    reporter.highlight_space(reporter.game.current_client().controller.checked_space);
    reporter.heavy_outline_space(
      {x: args.x, y: args.y},
      Reporters.Canvas.move_colours[args.type]
    );

    if (args.targets) {
      args.targets.forEach(target => {
        reporter.outline_space(target, 'red')
      })
    }
  }

  // The player makes a move.
  // In the UI, it's a click when a space is selected.
  // args.side
  // args.from.x
  // args.from.y
  // args.to.x
  // args.to.y
  move(args) {
    console.log(`${args.side} ${args.type} from ${args.from.x}:${args.from.y} to ${args.to.x}:${args.to.y}`);
  }

  // A piece has taken another piece (takes place after a move)
  // args.x
  // args.y
  // args.side
  piece_taken(args) {
    var reporter = this;
    function draw_marker(alpha) {
      reporter.overlay_context.beginPath();
      reporter.overlay_context.arc(
        (Reporters.Canvas.space_size * args.x) + (Reporters.Canvas.space_size / 2),
        Reporters.Canvas.space_size * args.y + (Reporters.Canvas.space_size / 2),
        (Reporters.Canvas.space_size / 2) * 0.8,
        0,
        2 * Math.PI);
      reporter.overlay_context.fillStyle = `rgba(255,0,0,${alpha})`;
      reporter.overlay_context.fill();
    }
    function clear_square() {
      reporter.overlay_context.clearRect(
        Reporters.Canvas.space_size * args.x,
        Reporters.Canvas.space_size * args.y,
        Reporters.Canvas.space_size,
        Reporters.Canvas.space_size
      );
    }
    var alpha = 1;
    var delta = 0.02;
    draw_marker(alpha);
    function fade() {
      alpha -= delta;
      clear_square();
      draw_marker(alpha);
      if(alpha >= 0) {
        requestAnimationFrame(fade);
      }
    }
    fade();
  }

  // Someone's earned some points
  // game.get_score()
  score(args) {
    var score = this.game.get_score();
    switch (score.winning) {
      case 'd':
        this.centre.classList.remove('troll');
        this.centre.classList.add('dwarf');
        break;
      case 't':
        this.centre.classList.remove('dwarf');
        this.centre.classList.add('troll');
        break;
      case '?':
        this.centre.classList.remove('dwarf');
        this.centre.classList.remove('troll');
    }
    this.dwarf_side.innerHTML = `${this.game.dwarves.length} dwarves: ${score.dwarves}`;
    this.troll_side.innerHTML = `${this.game.trolls.length} trolls: ${score.trolls}`;
    this.centre.innerHTML = score.difference;
  }

  // The game's over, awww.
  // args.reason
  // this.game.get_score()
  game_ended(args) {
    var score = this.game.get_score();
    var score_messages = {
      d: `Dwarves win by ${score.difference} points`,
      t: `Trolls win by ${score.difference} points`,
      '?': 'Nobody wins'
    }
    console.log(`Game Over! ${args.reason}`)
    console.log(score_messages[score.winning]);
    this.overlay_context.font = '45px Arial';
    if(score.winning=='d') {
      this.overlay_context.fillStyle = 'blue';
      this.overlay_context.strokeStyle = 'white';
    } else if (score.winning=='t') {
      this.overlay_context.fillStyle = 'green';
      this.overlay_context.strokeStyle = 'white';
    } else {
      this.overlay_context.fillStyle = 'white';
      this.overlay_context.strokeStyle = 'black';
    }
    this.overlay_context.textBaseline = 'middle';
    this.overlay_context.textAlign = 'center';
    this.end_text_line('Game Over!', 5);
    this.end_text_line(args.reason, 7.5);
    this.end_text_line(score_messages[score.winning], 10);
  }

  end_text_line(message, y) {
    this.overlay_context.fillText(
      message,
      (Reporters.Canvas.space_size * 7.5),
      (Reporters.Canvas.space_size * y)
    );
    this.overlay_context.strokeText(
      message,
      (Reporters.Canvas.space_size * 7.5),
      (Reporters.Canvas.space_size * y)
    );
  }

};
