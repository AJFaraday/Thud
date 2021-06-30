const Game = require('../../src/models/game.js');
const Clients = require('../../src/clients.js');

class ClientValidator {

  constructor(client_body, path) {
    this.path = path;
    this.client_body = client_body
    this.errors = [];
    this.valid = true;
    this.messages = [];
    this.game = new Game(
      {
        dwarf_client: 'inert/dummy',
        troll_client: 'inert/dummy'
      }
    );
    this.validate();
  }

  client_class() {
    if (this.cached_class) {
      return this.cached_class;
    } else {
      try {
        eval(`this.cached_class = ${this.client_body}`);
        return this.cached_class;
      } catch (error) {
        this.add_error(`Error evaluating code: ${error}`)
      }
    }
  }

  test_client() {
    if (this.cached_client) {
      return this.cached_client
    } else {
      var kls = this.client_class();
      if (this.valid) {
        var controller;
        if (this.is_dwarf()) {
          controller = this.game.dwarf_controller;
        } else {
          controller = this.game.troll_controller;
        }
        try {
          this.cached_client = new kls(controller);
          return this.cached_client;
        } catch (error) {
          this.add_error(`Error initializing test client: ${error}`);
        }
      }
    }
  }

  validate() {
    if (this.test_client()) {
      this.validate_game_not_used();
      this.validate_terms_not_used()
      // Validate presence of turn and end_turn functions
      if(this.valid) {
        this.validate_completes_games();
      }
    }
    return this.valid;
  }

  validate_terms_not_used() {
    ['Math.random', 'setTimeout', 'setInterval'].forEach(term => {
      if (this.client_body.includes(term)) {
        this.add_error(`Use of \`${term}\` is forbidden`);
      }
    });
  }

  validate_game_not_used() {
    if (this.client_body.includes('game.')) {
      this.add_error('Use of the `game` global variable is forbidden');
    }
  }

  validate_completes_games() {
    var opposite_side = this.is_dwarf() ? 'troll' : 'dwarf';
    Object.keys(Clients).forEach((client_path) => {
        if (client_path.includes(`${opposite_side}/default/`)) {
          var attrs;
          if (this.is_dwarf()) {
            attrs = {
              reporters: [],
              dwarf_client: this.client_class(),
              troll_client: client_path,
              delay: 0
            }
          } else {
            attrs = {
              reporters: [],
              dwarf_client: client_path,
              troll_client: this.client_class(),
              delay: 0
            }
          }
          try {
            var game = new Game(attrs);
            if (game.end_reason) {
              this.messages.push(`Completed game against ${client_path} in ${game.turn_number} turns`);
              var score = game.get_score();
              this.messages.push(`${game.end_reason}! ${score.winning} win by ${score.difference}`);
            } else {
              this.add_error(`Did not finish game against ${client_path}. Probably because this client did not call a valid move within the turn method`);
            }
          } catch (error) {
            this.add_error(`Error while running game against ${client_path}: ${error}`)
          }
        }
      }
    );
  }

  is_dwarf() {
    return this.path.includes('dwarf');
  }

  add_error(error) {
    this.errors.push(error);
    this.valid = false;
  }

}

module.exports = ClientValidator;