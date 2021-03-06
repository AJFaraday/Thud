const Controller = require('./../lib/controller.js');
const Board = require('./board.js');
const Reporters = require('../reporters.js');
const Clients = require('../clients.js');
const Utils = require('./../lib/utils.js');
const ControllerUtils = require('./../lib/controller_utils.js');

class Game {

  static max_game_length = 500;

  constructor(attrs) {
    this.initialise_properties(attrs);
    this.init_board();
    this.init_reporters(attrs);
    this.init_clients(attrs);
    this.report('score');
    this.current_side = 'd';
    this.turn();
  }

  reinit(dwarf_client, troll_client, delay = 0) {
    this.initialise_properties({delay: delay});
    this.init_board();
    this.reporters.forEach((reporter) => {
      reporter.reinit();
    });
    this.init_clients({dwarf_client: dwarf_client, troll_client: troll_client});
    this.report('score');
    this.current_side = 'd';
    this.turn();
  }

  init_board() {
    this.board = new Board(this);
  }

  initialise_properties(attrs) {
    this.delay = attrs.delay || 0;
    this.dwarfs = [];
    this.trolls = [];
    this.indexed_dwarfs = [];
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
    this.dwarf_client_name = attrs.dwarf_client;
    this.troll_client_name = attrs.troll_client;
    this.clients = {
      d: this.init_client(attrs.dwarf_client, this.dwarf_controller),
      t: this.init_client(attrs.troll_client, this.troll_controller)
    }
  }

  init_client(client_type, controller) {
    if (typeof client_type == 'string') {
      var client_class = Clients[client_type];
      var client = new client_class(controller, Object.assign({}, ControllerUtils));
      // belt, meet braces
      client.controller = controller;
      return client
    } else {
      var client = new client_type(controller, Object.assign({}, ControllerUtils));
      // belt, meet braces
      client.controller = controller;
      return client
    }
  }

  get_score() {
    var dwarf_score = this.dwarfs.length
    var troll_score = (this.trolls.length * 4)
    var winning = ((dwarf_score > troll_score) ? 'd' : 't')
    if (dwarf_score == troll_score) {
      winning = '?'
    }
    return {
      dwarfs: dwarf_score,
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
      this.end_reason = ending.reason;
      this.report('game_ended', ending);
    } else {
      if (this.delay && this.delay > 0) {
        console.log(this.delay)
        setTimeout(() => {
          this.turn()
        }, this.delay);
      } else {
        this.turn();
      }
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
    Utils.remove_from_array(this.dwarfs, space.piece);
    Utils.nullify_from_array(this.indexed_trolls, space.piece);
    Utils.nullify_from_array(this.indexed_dwarfs, space.piece);
    space.piece = null;
  }

  check_ending_conditions() {
    if (this.turn_number >= Game.max_game_length) {
      return {reason: 'Timeout'}
    } else if (this.dwarfs.length == 0) {
      return {reason: 'No more dwarfs'}
    } else if (this.trolls.length == 0) {
      return {reason: 'No more trolls'}
    } else if (this.troll_controller.declared && this.dwarf_controller.declared) {
      return {reason: 'Players agreed to finish'}
    }

  }
}

module.exports = Game;