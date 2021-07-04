const Utils = require('./../lib/utils.js');

class Canvas {

  static space_colours = ['lightgrey', 'darkgrey'];
  static space_size = 40;
  static move_colours = {
    walk: 'yellow',
    hurl: 'red',
    take: 'red',
    yello: 'red'
  };

  constructor(game) {
    var reporter = this;
    reporter.game = game;
    reporter.board = game.board;
    document.getElementById('thud').style['width'] = `${Canvas.space_size * 15}px`
    reporter.build_overlay_canvas();
    reporter.build_canvas();
    reporter.build_dashboard();
    reporter.draw_board();
    reporter.build_declare_buttons();
    this.build_customise_button();
    this.build_league_table_button();
    this.build_matches_button();
  }

  reinit() {
    document.getElementById('thud_dashboard').innerHTML = "";
    document.getElementById('thud_board').innerHTML = "";
    document.getElementById('buttons').innerHTML = "";
    this.build_overlay_canvas();
    this.build_canvas();
    this.build_dashboard();
    this.draw_board();
    this.build_declare_buttons();
    this.build_customise_button();
    this.build_league_table_button();
    this.build_matches_button();
  }

  build_canvas() {
    this.canvas = Utils.build_element(
      'canvas',
      {
        height: Canvas.space_size * 15,
        width: Canvas.space_size * 15,
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
        height: Canvas.space_size * 15,
        width: Canvas.space_size * 15,
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
    this.dwarf_side = this.build_side('blue', 'Dwarfs');
    this.centre = this.build_centre();
    this.troll_side = this.build_side('green', 'Trolls');
    this.dashboard.append(this.dwarf_side);
    this.dashboard.append(this.centre);
    this.dashboard.append(this.troll_side);
  }

  build_declare_buttons() {
    this.dwarf_declare_button = Utils.build_element(
      'div',
      {
        id: 'dwarf_declare_button',
        class: 'declare_button dwarf',
        'data-over': false
      },
      {float: 'left'}
    );
    this.dwarf_declare_button.innerHTML = 'Make Peace';
    document.getElementById('buttons').append(this.dwarf_declare_button);
    this.troll_declare_button = Utils.build_element(
      'div',
      {
        id: 'troll_declare_button',
        class: 'declare_button troll',
        'data-over': false
      },
      {float: 'right'}
    );
    this.troll_declare_button.innerHTML = 'Make Peace';
    document.getElementById('buttons').append(this.troll_declare_button);
  }

  build_customise_button() {
    this.customise_button = Utils.build_element(
      'div',
      {
        id: 'customise_button',
        class: 'grey_button'
      }
    );
    this.customise_button.innerHTML = 'Customise';
    Utils.addListener(this.customise_button, 'mouseup', () => {
      window.modal.show_form()
    }, false);
    var buttons_div = document.getElementById('buttons');
    buttons_div.append(this.customise_button);
  }

  build_league_table_button() {
    this.league_table_button = Utils.build_element(
      'div',
      {
        id: 'league_button',
        class: 'grey_button'
      }
    );
    this.league_table_button.innerHTML = 'League Table';
    Utils.addListener(this.league_table_button, 'mouseup', () => {
      window.location.href = './tables.html'
    }, false);
    var buttons_div = document.getElementById('buttons');
    buttons_div.append(this.league_table_button);
  }

  build_matches_button() {
    this.matches_button = Utils.build_element(
      'div',
      {
        id: 'matches_button',
        class: 'grey_button'
      }
    );
    this.matches_button.innerHTML = 'Matches';
    Utils.addListener(this.matches_button, 'mouseup', () => {
      window.location.href = './matches.html'
    }, false);
    var buttons_div = document.getElementById('buttons');
    buttons_div.append(this.matches_button);
  }

  build_side(colour, title) {
    var side = Utils.build_element(
      'div',
      {class: 'dashboard_panel'},
      {
        'background-color': colour,
        opacity: 0.7,
        width: `${(Canvas.space_size * 6) - 5}px`
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
        width: `${Canvas.space_size * 3}px`,
      }
    );
  }

  draw_board() {
    var reporter = this;
    reporter.clear_canvas();
    reporter.board.rows.forEach(
      row => row.forEach(space => reporter.draw_space(space, reporter))
    );
    reporter.game.dwarfs.forEach(dwarf => reporter.draw_piece(dwarf, 'blue'));
    reporter.game.trolls.forEach(troll => reporter.draw_piece(troll, 'green'));
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
      this.context.fillStyle = Canvas.space_colours[space.colour_index];
      this.context.fillRect(
        Canvas.space_size * space.x,
        Canvas.space_size * space.y,
        Canvas.space_size,
        Canvas.space_size
      );
    }
  }

  outline_space(space, colour) {
    if (space) {
      this.context.strokeStyle = colour;
      this.context.lineWidth = 3;
      this.context.strokeRect(
        Canvas.space_size * space.x,
        Canvas.space_size * space.y,
        Canvas.space_size,
        Canvas.space_size
      );
    }
  }

  heavy_outline_space(space, colour) {
    if (space) {
      this.context.strokeStyle = colour;
      this.context.lineWidth = 5;
      this.context.strokeRect(
        Canvas.space_size * space.x,
        Canvas.space_size * space.y,
        Canvas.space_size,
        Canvas.space_size
      );
    }
  }

  draw_piece(space, colour) {
    this.context.beginPath();
    this.context.arc(
      (Canvas.space_size * space.x) + (Canvas.space_size / 2),
      Canvas.space_size * space.y + (Canvas.space_size / 2),
      (Canvas.space_size / 2) * 0.8,
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
  // args.turn
  turn_starts(args) {
    if (args.side == 'd') {
      this.dwarf_side.style.opacity = 1;
      this.troll_side.style.opacity = 0.6;
      this.dwarf_declare_button.style.opacity = 1;
      this.troll_declare_button.style.opacity = 0.4;
    } else if (args.side == 't') {
      this.troll_side.style.opacity = 1;
      this.dwarf_side.style.opacity = 0.6;
      this.troll_declare_button.style.opacity = 1;
      this.dwarf_declare_button.style.opacity = 0.4;
    }
    this.draw_board();
  }

  // The player is thinking about moving from this space
  // In the UI, this is a mouse hover, before a space is selected.
  // args.x
  // args.y
  // args.moves
  // args.in_danger
  highlight_space(args) {
    var reporter = this;
    reporter.draw_board();
    if(args.in_danger) {
      reporter.heavy_outline_space(args, 'orange');
    } else {
      reporter.outline_space(args, 'lightgreen');
    }
    args.moves.forEach(
      move => {
          if (move.in_danger) {
          reporter.outline_space(move, 'orange');
        } else {
          reporter.outline_space(move, Canvas.move_colours[move.type]);
        }
      }
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
  highlight_move(args) {
    var reporter = this;
    reporter.draw_board();
    reporter.highlight_space(reporter.game.current_client().controller.checked_space);
    if (args.kills >= 1) {
      reporter.heavy_outline_space(args, 'red');
    } else if (args.in_danger) {
      reporter.heavy_outline_space(args, 'orange');
    } else {
      reporter.heavy_outline_space(args, Canvas.move_colours[args.type]);
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
        (Canvas.space_size * args.x) + (Canvas.space_size / 2),
        Canvas.space_size * args.y + (Canvas.space_size / 2),
        (Canvas.space_size / 2) * 0.8,
        0,
        2 * Math.PI);
      reporter.overlay_context.fillStyle = `rgba(255,0,0,${alpha})`;
      reporter.overlay_context.fill();
    }

    function clear_square() {
      reporter.overlay_context.clearRect(
        Canvas.space_size * args.x,
        Canvas.space_size * args.y,
        Canvas.space_size,
        Canvas.space_size
      );
    }

    var alpha = 1;
    var delta = 0.02;
    draw_marker(alpha);

    function fade() {
      alpha -= delta;
      clear_square();
      draw_marker(alpha);
      if (alpha >= 0) {
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
    this.dwarf_side.innerHTML = `${this.game.dwarfs.length} dwarfs: ${score.dwarfs}`;
    this.troll_side.innerHTML = `${this.game.trolls.length} trolls: ${score.trolls}`;
    this.centre.innerHTML = score.difference;
  }

// A player has declared that the game is over (or retracted that declaration
// args.side
// args.game_over
  player_declared(args) {
    var button;
    if (args.side == 'd') {
      button = this.dwarf_declare_button;
    } else if (args.side == 't') {
      button = this.troll_declare_button;
    }
    if (args.game_over) {
      button.innerHTML = 'Make War';
    } else {
      button.innerHTML = 'Make Peace';
    }
  }

// The game's over, awww.
// args.reason
// this.game.get_score()
  game_ended(args) {
    var score = this.game.get_score();
    var score_messages = {
      d: `Dwarfs win by ${score.difference} points`,
      t: `Trolls win by ${score.difference} points`,
      '?': 'Nobody wins'
    }
    this.overlay_context.font = '45px Arial';
    if (score.winning == 'd') {
      this.overlay_context.fillStyle = 'blue';
      this.overlay_context.strokeStyle = 'white';
    } else if (score.winning == 't') {
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
      (Canvas.space_size * 7.5),
      (Canvas.space_size * y)
    );
    this.overlay_context.strokeText(
      message,
      (Canvas.space_size * 7.5),
      (Canvas.space_size * y)
    );
  }

}

module.exports = Canvas;
