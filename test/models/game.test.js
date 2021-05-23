const Game = require('../../src/models/game.js');
const Controller = require('../../src/lib/controller');
const Reporters = require('../../src/reporters.js');
const Clients = require('../../src/clients.js');

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
      from: {x: 0, y: 0},
      to: {x: 0, y: 0},
      type: 'game_start',
      killed: 0,
      lost: 0
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
  game.clients.d = {turn: dwarf_turn, end_turn: dwarf_end_turn,controller: game.dwarf_controller};
  var troll_turn = jest.fn();
  var troll_end_turn = jest.fn();
  game.clients.t = {turn: troll_turn, end_turn: troll_end_turn,controller: game.troll_controller};

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