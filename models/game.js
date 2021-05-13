class Game {
  constructor(attrs) {
    this.initialise_properties();
    this.init_board();
    this.init_reporters(attrs);
    this.init_clients(attrs);
    this.current_side = 'd';
    this.turn();
  }

  init_board() {
    this.board = new Board(this);
    this.scores = {
      d: this.dwarves.length,
      t: (this.trolls.length * 4)
    }
  }

  initialise_properties() {
    this.dwarves = [];
    this.trolls = [];
    this.turn_number = 0;
    this.dwarf_controller = new Controller(this, 'd');
    this.troll_controller = new Controller(this, 't');
    this.previous_move = {
      from: {x: 0, y: 0},
      to: {x: 0, y: 0},
      type: 'game_start',
      killed: 0,
      lost: 0
    }

  }

  init_reporters(attrs) {
    var game = this;
    game.reporters = []
    if (attrs.reporters) {
      attrs.reporters.forEach(
        function (reporter_name) {
          game.attach_reporter(reporter_name);
        }
      );
    }
  }

  attach_reporter(name) {
    this.reporters.push(new Reporters[name](this));
  }

  report(event, args) {
    this.reporters.forEach(
      function (reporter) {
        reporter[event](args);
      }
    )
  }

  init_clients(attrs) {
    this.clients = {
      d: this.init_client(attrs.dwarf_client, this.dwarf_controller),
      t: this.troll_client = this.init_client(attrs.troll_client, this.troll_controller)
    }
  }

  init_client(client_type, controller) {
    if (typeof client_type == 'string') {
      var client_class = Clients[client_type];
      return new client_class(this, controller);
    } else {
      return new client_type(this, controller);
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
    this.report('board_state', {});
    this.turn();
  }

  current_client() {
    return this.clients[this.current_side];
  }

  swap_side() {
    if(this.current_side == 'd') {
      this.current_side = 't'
    } else if (this.current_side == 't') {
      this.current_side = 'd'
    }
  }

}