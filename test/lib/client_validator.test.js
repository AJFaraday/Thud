const Game = require('../../src/models/game.js');
const ClientValidator = require('../../src/lib/client_validator.js');

function new_game() {
  return new Game(
    {
      reporters: [],
      dwarf_client: 'inert/dummy',
      troll_client: 'inert/dummy'
    }
  );
}


var dwarf_client = `class {
                     constructor(controller) {
                       this.controller = controller;
                       this.side = controller.side;
                       this.it_is_a_day = false;
                     }

                     turn() {
                       var dwarf = this.controller.dwarfs()[7];
                       if(dwarf) {
                         var moves = this.controller.check_space(dwarf.x, dwarf.y).moves;
                         if(moves[7]) {
                           this.controller.select_space(dwarf.x, dwarf.y);
                           this.controller.move(moves[7].x, moves[7].y);
                         } else {
                           this.call_it_a_day();
                         }
                       } else {
                         this.call_it_a_day();
                       }
                     }

                     call_it_a_day() {
                       this.it_is_a_day = true;
                       this.controller.declare(true);

                       var dwarf = this.controller.dwarfs()[0];
                       var moves = this.controller.check_space(dwarf.x, dwarf.y).moves;
                       this.controller.select_space(dwarf.x, dwarf.y);
                       this.controller.move(moves[0].x, moves[0].y);
                     }

                     end_turn() {
                       var scores = this.controller.scores();
                       this.controller.declare(this.it_is_a_day || scores.winning == 'd');
                     }

                   }`

test('initializes with client_body and path', () => {
  var client_validator = new ClientValidator(dwarf_client, 'dwarf/test/simple');
  expect(client_validator).toBeInstanceOf(ClientValidator);
  expect(client_validator.path).toEqual('dwarf/test/simple');
  expect(client_validator.client_class()).not.toBeUndefined();
  expect(client_validator.test_client()).toBeInstanceOf(client_validator.client_class());
  expect(client_validator.valid).toBeTruthy();
  expect(client_validator.messages).toBeInstanceOf(Array);
  expect(client_validator.messages).toEqual([
    "Completed game against troll/default/last_move in 77 turns",
    "Players agreed to finish! t win by 25",
    "Completed game against troll/default/spread_out in 84 turns",
    "No more dwarfs! t win by 32"
  ]);
  expect(client_validator.errors).toBeInstanceOf(Array);
  expect(client_validator.errors.length).toEqual(0);

});

test('should error when the code does not evaluate', () => {
  var body = `class {`
  var client_validator = new ClientValidator(body, 'dwarf/test/simple');
  expect(client_validator).toBeInstanceOf(ClientValidator);
  expect(client_validator.path).toEqual('dwarf/test/simple');
  expect(client_validator.errors.length).toEqual(1);
  expect(client_validator.errors[0]).toEqual('Error evaluating code: SyntaxError: Unexpected end of input')
  expect(client_validator.client_class()).toBeUndefined();
  expect(client_validator.test_client()).toBeUndefined();
});

test('should error when the class does not initialize', () => {
  var body = `class {
    constructor(thing) {
      throw 'oops';
    }
  }`
  var client_validator = new ClientValidator(body, 'dwarf/test/simple');
  expect(client_validator).toBeInstanceOf(ClientValidator);
  expect(client_validator.path).toEqual('dwarf/test/simple');
  expect(client_validator.client_class()).not.toBeUndefined();
  expect(client_validator.test_client()).toBeUndefined();
  expect(client_validator.errors.length).toEqual(1);
  expect(client_validator.errors[0]).toEqual('Error initializing test client: oops');
  expect(client_validator.is_dwarf()).toEqual(true);
});

test("should validate it doesn't use `game`", () => {
  var body = `class {
  constructor(controller) {
    this.controller = controller;
    this.side = controller.side;
  }
  turn() {
  game.score.dwarfs = 100;
  }
  end_turn() {
  }
}`
  var client_validator = new ClientValidator(body, 'dwarf/test/simple');
  expect(client_validator.valid).toBeFalsy();
  console.log(client_validator.errors);
  expect(client_validator.errors.length).toEqual(3);
  expect(client_validator.errors[0]).toEqual("Use of the `game` global variable is forbidden");
  expect(client_validator.errors[1]).toEqual("Error while running game against troll/default/last_move: ReferenceError: game is not defined");
  expect(client_validator.errors[2]).toEqual("Error while running game against troll/default/spread_out: ReferenceError: game is not defined");
});

test("should validate it doesn't use `Math.random`", () => {
  var body = `class {
  constructor(controller) {
    this.controller = controller;
    this.side = controller.side;
  }
  turn() {
    Math.random()
    setInterval()
    setTimeout()
  }
  end_turn() {
  }
}`
  var client_validator = new ClientValidator(body, 'dwarf/test/simple');
  expect(client_validator.valid).toBeFalsy();
  expect(client_validator.errors.length).toEqual(5);
  expect(client_validator.errors).toContainEqual("Use of `Math.random` is forbidden");
  expect(client_validator.errors).toContainEqual("Use of `setTimeout` is forbidden");
  expect(client_validator.errors).toContainEqual("Use of `setInterval` is forbidden");
  expect(client_validator.errors).toContainEqual("Did not finish game against troll/default/last_move. Probably because this client did not call a valid move within the turn method");
  expect(client_validator.errors).toContainEqual("Did not finish game against troll/default/spread_out. Probably because this client did not call a valid move within the turn method");
});

it('should check it can complete a match', () => {
  // positive case
  var client_body = `class {
    constructor(controller) {
      this.controller = controller;
      this.side = controller.side;
    }

    turn() {
      var dwarf = this.controller.dwarfs()[0];
      if(dwarf) {
        var moves = this.controller.check_space(dwarf.x, dwarf.y).moves;
        if(moves[0]) {
          this.controller.select_space(dwarf.x, dwarf.y);
          this.controller.move(moves[0].x, moves[0].y);
        }
      }
    }

    end_turn() {
    }

  }`
  var client_validator = new ClientValidator(client_body, 'dwarf/test/simple');

  expect(client_validator.valid).toEqual(true);
  expect(client_validator.messages.length).toEqual(4);
  expect(client_validator.messages[0]).toEqual('Completed game against troll/default/last_move in 68 turns');
  expect(client_validator.messages[1]).toEqual('No more dwarfs! t win by 32');
  expect(client_validator.messages[2]).toEqual('Completed game against troll/default/spread_out in 80 turns');
  expect(client_validator.messages[3]).toEqual('No more dwarfs! t win by 32');

  // Negative case
  var client_body = `class {
    constructor(controller) {
      this.controller = controller;
      this.side = controller.side;
    }

    turn() {
      var dwarf = this.controller.dwarfs()[0];
      if(this.controller.turn() < 10) {
        if(dwarf) {
          var moves = this.controller.check_space(dwarf.x, dwarf.y).moves;
          if(moves[0]) {
            this.controller.select_space(dwarf.x, dwarf.y);
            this.controller.move(moves[0].x, moves[0].y);
          }
        }
      }  
    }

    end_turn() {
    }

  }`
  var client_validator = new ClientValidator(client_body, 'dwarf/test/simple');
  expect(client_validator.valid).toEqual(false);
  expect(client_validator.errors.length).toEqual(2);
  expect(client_validator.errors[0]).toEqual(
    'Did not finish game against troll/default/last_move. Probably because this client did not call a valid move within the turn method'
  );
  expect(client_validator.errors[1]).toEqual(
    'Did not finish game against troll/default/spread_out. Probably because this client did not call a valid move within the turn method'
  );
});
