const Game = require('../../src/models/game.js');

class ClientValidator {

  constructor(client_body, path) {
    this.path = path;
    this.client_body = client_body
    this.errors = [];
    this.valid = true;
    this.game = new Game(
      {
        dwarf_client: 'inert/dummy',
        troll_client: 'inert/dummy'
      }
    );
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
      this.validate_random_not_used();
      //this.validate_completes_game();
    }
    return this.valid;
  }

  validate_game_not_used() {
    if(this.client_body.includes('game.')) {
      this.add_error('Use of the `game` global variable is forbidden');
    }
  }

  validate_random_not_used() {
    if(this.client_body.includes('Math.random')) {
      this.add_error('Use of the `Math.random` function is forbidden');
    }
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