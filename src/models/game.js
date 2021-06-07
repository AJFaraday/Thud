const Controller = require('./../lib/controller.js');
const Board = require('./board.js');
const Reporters = require('../reporters.js');
const Clients = require('../clients.js');
const Utils = require('./../lib/utils.js');

class Game {

  static max_game_length = 200;

  constructor(attrs) {
    this.initialise_properties();
    this.init_board();
    this.init_reporters(attrs);
    this.init_clients(attrs);
    this.report('score');
    this.current_side = 'd';
    this.turn();
  }

  reinit(dwarf_client, troll_client) {
    this.initialise_properties();
    this.init_board();
    this.reporters.forEach((reporter) => {
      reporter.reinit();
    });
    this.clients = {
      d: this.init_client(dwarf_client, this.dwarf_controller),
      t: this.init_client(troll_client, this.troll_controller)
    }
    this.report('score');
    this.current_side = 'd';
    this.turn();
  }

  init_board() {
    this.board = new Board(this);
  }

  initialise_properties() {
    this.dwarves = [];
    this.trolls = [];
    this.indexed_dwarves = [];
    this.indexed_trolls = [];
    this.turn_number = 0;
    this.dwarf_controller = new Controller(this, 'd');
    this.troll_controller = new Controller(this, 't');
    this.previous_move = {
      side: '?',
      from: {x: 0, y: 0},
      to: {x: 0, y: 0},
      type: 'game_start',
      killed: 0
    }

  }

  init_reporters(attrs) {
    var game = this;
    game.reporters = []
    if (attrs.reporters) {
      attrs.reporters.forEach(
        reporter_name => game.attach_reporter(reporter_name)
      );
    }
  }

  attach_reporter(name) {
    this.reporters.push(new Reporters[name](this));
  }

  report(event, args = {}) {
    this.reporters.forEach(reporter => {
        if (reporter[event]) {
          reporter[event](args)
        }
      }
    );
  }

  init_clients(attrs) {
    this.clients = {
      d: this.init_client(attrs.dwarf_client, this.dwarf_controller),
      t: this.init_client(attrs.troll_client, this.troll_controller)
    }
  }

  init_client(client_type, controller) {
    if (typeof client_type == 'string') {
      if (client_type.includes('/')) {
        var parts = client_type.split('/');
        var client_class = Clients[parts[0]][parts[1]];
        console.log(client_class)
        return new client_class(this, controller);
      } else {
        var client_class = Clients[client_type];
        return new client_class(this, controller);
      }
    } else {
      return new client_type(this, controller);
    }
  }

  get_score() {
    var dwarf_score = this.dwarves.length
    var troll_score = (this.trolls.length * 4)
    var winning = ((dwarf_score > troll_score) ? 'd' : 't')
    if (dwarf_score == troll_score) {
      winning = '?'
    }
    return {
      dwarves: dwarf_score,
      trolls: troll_score,
      difference: Math.abs(dwarf_score - troll_score),
      winning: winning
    }
  }

  turn() {
    this.turn_number += 1;
    this.report('turn_starts', {side: this.current_side, turn: this.turn_number})
    this.current_client().turn();
  }

  end_turn() {
    this.current_client().end_turn();
    this.swap_side();
    this.report('board_state');
    this.report('score');
    var ending = this.check_ending_conditions();
    if (ending) {
      this.report('game_ended', ending);
    } else {
      this.turn();
    }
  }

  current_client() {
    return this.clients[this.current_side];
  }

  current_controller() {
    return this.current_client().controller;
  }

  swap_side() {
    this.current_side = (this.current_side == 'd') ? 't' : 'd';
  }

  // move current piece (from select_space) to x, y
  move_piece(x, y, type) {
    var from = this.board.space(
      this.current_client().controller.current_space.x,
      this.current_client().controller.current_space.y
    );
    var to = this.board.space(x, y);
    this.report(
      'move',
      {
        side: from.piece.type,
        from: {x: from.x, y: from.y},
        to: {x: to.x, y: to.y},
        type: type
      }
    )
    if (to.piece) {
      this.report('piece_taken', {x: to.x, y: to.y, side: to.piece.type});
      this.remove_piece(to);
    }
    to.piece = from.piece;
    from.piece = null;
    to.piece.x = to.x;
    to.piece.y = to.y;
  }

  remove_piece(space) {
    Utils.remove_from_array(this.trolls, space.piece);
    Utils.remove_from_array(this.dwarves, space.piece);
    Utils.nullify_from_array(this.indexed_trolls, space.piece);
    Utils.nullify_from_array(this.indexed_dwarves, space.piece);
    space.piece = null;
  }

  check_ending_conditions() {
    if (this.turn_number >= Game.max_game_length) {
      return {reason: 'Timeout'}
    } else if (this.dwarves.length == 0) {
      return {reason: 'No more dwarves'}
    } else if (this.trolls.length == 0) {
      return {reason: 'No more trolls'}
    } else if (this.troll_controller.declared && this.dwarf_controller.declared) {
      return {reason: 'Players agreed to finish'}
    }

  }
}

module.exports = Game;