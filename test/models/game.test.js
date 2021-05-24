const Game = require('../../src/models/game.js');
const Controller = require('../../src/lib/controller');
const Reporters = require('../../src/reporters.js');
const Clients = require('../../src/clients.js');
const Piece = require('../../src/models/piece.js');

function new_game() {
  return new Game(
    {
      reporters: [],
      dwarf_client: 'Dummy',
      troll_client: 'Dummy'
    }
  );
}

it('should have initial properties', () => {
  var game = new_game();
  expect(game.dwarves).toBeInstanceOf(Array);
  expect(game.dwarves.length).toEqual(32);
  expect(game.trolls).toBeInstanceOf(Array);
  expect(game.trolls.length).toEqual(8);
  expect(game.indexed_dwarves).toBeInstanceOf(Array);
  expect(game.indexed_dwarves.length).toEqual(32);
  expect(game.indexed_trolls).toBeInstanceOf(Array);
  expect(game.indexed_trolls.length).toEqual(8);
  expect(game.turn_number).toEqual(1);
  expect(game.dwarf_controller).toBeInstanceOf(Controller);
  expect(game.dwarf_controller.side).toEqual('d');
  expect(game.troll_controller).toBeInstanceOf(Controller);
  expect(game.troll_controller.side).toEqual('t');
  expect(game.previous_move).toEqual(
    {
      side: '?',
      from: {x: 0, y: 0},
      to: {x: 0, y: 0},
      type: 'game_start',
      killed: 0
    }
  )
});

it('should build reporters by name and report to them', () => {
  var game = new Game(
    {
      reporters: ['Console'],
      dwarf_client: 'Dummy',
      troll_client: 'Dummy'
    }
  );
  var reporter = game.reporters[0];
  expect(reporter).toBeInstanceOf(Reporters.Console);

  var mock_function = jest.fn();
  game.reporters.push({board_state: mock_function});
  game.report('board_state')
  expect(mock_function).toHaveBeenCalled();
});

it('should build clients based on names', () => {
  var game = new Game(
    {
      reporters: [],
      dwarf_client: 'Dummy',
      troll_client: 'DummyTwo'
    }
  );
  expect(game.clients.d).toBeInstanceOf(Clients.Dummy)
  expect(game.clients.t).toBeInstanceOf(Clients.DummyTwo)
});

it('should get the score based on current state', () => {
  var game = new_game();
  expect(game.get_score()).toEqual(
    {
      dwarves: 32,
      trolls: 32,
      difference: 0,
      winning: '?'
    }
  );
  game.dwarf_controller.select_space(4, 1);
  game.dwarf_controller.move(8, 5);
  game.troll_controller.select_space(7, 6);
  game.troll_controller.move(9, 4);
  expect(game.get_score()).toEqual(
    {
      dwarves: 31,
      trolls: 32,
      difference: 1,
      winning: 't'
    }
  );
});

test('should run a clients turn method', () => {
  var game = new_game();
  var dwarf_turn = jest.fn();
  var dwarf_end_turn = jest.fn();
  game.clients.d = {turn: dwarf_turn, end_turn: dwarf_end_turn, controller: game.dwarf_controller};
  var troll_turn = jest.fn();
  var troll_end_turn = jest.fn();
  game.clients.t = {turn: troll_turn, end_turn: troll_end_turn, controller: game.troll_controller};

  expect(game.current_side).toEqual('d');
  expect(dwarf_turn).not.toHaveBeenCalled();
  game.turn();
  expect(dwarf_turn).toHaveBeenCalled();
  expect(dwarf_end_turn).not.toHaveBeenCalled();
  expect(troll_turn).not.toHaveBeenCalled();
  expect(troll_end_turn).not.toHaveBeenCalled();

  game.dwarf_controller.select_space(4, 1);
  game.dwarf_controller.move(8, 5);

  expect(game.current_side).toEqual('t');
  expect(dwarf_end_turn).toHaveBeenCalled();
  expect(troll_turn).toHaveBeenCalled();
  expect(troll_end_turn).not.toHaveBeenCalled();

  game.troll_controller.select_space(7, 6);
  game.troll_controller.move(9, 4);
  expect(game.current_side).toEqual('d');
  expect(troll_end_turn).toHaveBeenCalled();
  expect(dwarf_turn).toHaveBeenCalledTimes(2);
});

test('gets current client', () => {
  var game = new_game();
  expect(game.current_side).toEqual('d');
  expect(game.current_client()).toEqual(game.clients.d);
  expect(game.current_controller()).toEqual(game.dwarf_controller);
  game.dwarf_controller.select_space(4, 1);
  game.dwarf_controller.move(8, 5);
  expect(game.current_side).toEqual('t');
  expect(game.current_client()).toEqual(game.clients.t);
  expect(game.current_controller()).toEqual(game.troll_controller);
});

test('moves a piece', () => {
  var game = new_game();
  game.dwarf_controller.select_space(4, 1);
  game.move_piece(8, 5, 'd');
  var space = game.board.space(4,1);
  expect(space.piece).toBeNull();
  space = game.board.space(8,5);
  expect(space.piece).toBeInstanceOf(Piece);
  expect(space.piece.type).toEqual('d');
});

test('removes a piece', () => {
  var game = new_game();
  expect(game.trolls.length).toEqual(8);
  expect(game.indexed_trolls.length).toEqual(8);
  expect(game.indexed_trolls[7]).toBeInstanceOf(Piece);
  expect(game.indexed_trolls[7].type).toEqual('t');

  game.remove_piece(game.board.space(8,8));
  var space = game.board.space(8,8);
  expect(space.piece).toBeNull();
  expect(game.trolls.length).toEqual(7);
  expect(game.indexed_trolls.length).toEqual(8);
  expect(game.indexed_trolls[7]).toBeNull();
});

test('ends the game after 200 turns', () => {
  var game = new_game();
  game.end_turn();
  expect(game.check_ending_conditions()).toBeUndefined();

  game.turn_number = 201;
  game.end_turn();
  expect(game.check_ending_conditions()).toEqual({"reason": "Timeout"});
})

test('endsthe game if there are no more dwarves', () => {
  var game = new_game();
  game.end_turn();
  expect(game.check_ending_conditions()).toBeUndefined();

  game.dwarves = [];
  game.end_turn();
  expect(game.check_ending_conditions()).toEqual({"reason": "No more dwarves"});
});

test('endsthe game if there are no more trolls', () => {
  var game = new_game();
  game.end_turn();
  expect(game.check_ending_conditions()).toBeUndefined();

  game.trolls = [];
  game.end_turn();
  expect(game.check_ending_conditions()).toEqual({"reason": "No more trolls"});
});

test('ends the game if the players are finished', () => {
  var game = new_game();
  game.end_turn();
  expect(game.check_ending_conditions()).toBeUndefined();

  game.troll_controller.declared = true;
  game.end_turn();
  expect(game.check_ending_conditions()).toBeUndefined();

  game.troll_controller.declared = false;
  game.dwarf_controller.declared = true;
  game.end_turn();
  expect(game.check_ending_conditions()).toBeUndefined();

  game.dwarf_controller.declared = true;
  game.troll_controller.declared = true;
  game.end_turn();
  expect(game.check_ending_conditions()).toEqual({"reason": "Players agreed to finish"});
});

test('records the previous move', () => {
  var game = new_game();
  expect(game.previous_move).toEqual(
    {
      side: '?',
      from: {x: 0, y: 0},
      to: {x: 0, y: 0},
      type: 'game_start',
      killed: 0
    }
  );

  game.dwarf_controller.select_space(4, 1);
  game.dwarf_controller.move(8, 5);

  expect(game.previous_move).toEqual(
    {
      side: 'd',
      from: {x: 4, y: 1},
      to: {x: 8, y: 5},
      type: 'walk',
      killed: 0
    }
  );
});