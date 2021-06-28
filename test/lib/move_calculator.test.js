const Game = require('../../src/models/game.js');
const MoveCalculator = require('../../src/lib/move_calculator.js');

function new_game() {
  return new Game(
    {
      reporters: [],
      dwarf_client: 'inert/dummy',
      troll_client: 'inert/dummy'
    }
  );
}

it('knows a dwarf can walk as far as they like', () => {
  var game = new_game();
  var space = game.board.space(4, 1);
  var move_calculator = new MoveCalculator(game.board, space, 'd');
  expect(move_calculator.moves).toContainEqual({x: 9, y: 1, type: 'walk', kills: 0, in_danger: false}); // east
  expect(move_calculator.moves).toContainEqual({x: 12, y: 9, type: 'walk', kills: 0, in_danger: true}); //south east
  expect(move_calculator.moves).toContainEqual({x: 4, y: 2, type: 'walk', kills: 0, in_danger: false}); // south...
  expect(move_calculator.moves).toContainEqual({x: 4, y: 3, type: 'walk', kills: 0, in_danger: true});
  expect(move_calculator.moves).toContainEqual({x: 4, y: 4, type: 'walk', kills: 0, in_danger: true});
  expect(move_calculator.moves).toContainEqual({x: 4, y: 5, type: 'walk', kills: 0, in_danger: true});
  expect(move_calculator.moves).toContainEqual({x: 4, y: 6, type: 'walk', kills: 0, in_danger: true});
  expect(move_calculator.moves).toContainEqual({x: 4, y: 7, type: 'walk', kills: 0, in_danger: true});
  expect(move_calculator.moves).toContainEqual({x: 4, y: 8, type: 'walk', kills: 0, in_danger: true});
  expect(move_calculator.moves).toContainEqual({x: 4, y: 9, type: 'walk', kills: 0, in_danger: true});
  expect(move_calculator.moves).toContainEqual({x: 4, y: 10, type: 'walk', kills: 0, in_danger: true});
  expect(move_calculator.moves).toContainEqual({x: 4, y: 11, type: 'walk', kills: 0, in_danger: true});
  expect(move_calculator.moves).toContainEqual({x: 4, y: 12, type: 'walk', kills: 0, in_danger: false});
});

it('knows a troll can only walk one space', () => {
  var game = new_game();
  var space = game.board.space(6, 6);
  var move_calculator = new MoveCalculator(game.board, space, 't');
  expect(move_calculator.moves).toContainEqual({x: 5, y: 7, type: 'walk', kills: 0, in_danger: false}); // SW
  expect(move_calculator.moves).toContainEqual({x: 5, y: 6, type: 'walk', kills: 0, in_danger: false}); // W
  expect(move_calculator.moves).toContainEqual({x: 5, y: 5, type: 'walk', kills: 0, in_danger: false}); // NW
  expect(move_calculator.moves).toContainEqual({x: 6, y: 5, type: 'walk', kills: 0, in_danger: false}); // N
  expect(move_calculator.moves).toContainEqual({x: 7, y: 5, type: 'walk', kills: 0, in_danger: false}); // NE
  // Negative tests for 2 steps
  expect(move_calculator.moves).not.toContainEqual({x: 4, y: 8, type: 'walk', kills: 0, in_danger: false}); // SW
  expect(move_calculator.moves).not.toContainEqual({x: 4, y: 6, type: 'walk', kills: 0, in_danger: false}); // W
  expect(move_calculator.moves).not.toContainEqual({x: 4, y: 4, type: 'walk', kills: 0, in_danger: false}); // NW
  expect(move_calculator.moves).not.toContainEqual({x: 6, y: 4, type: 'walk', kills: 0, in_danger: false}); // N
  expect(move_calculator.moves).not.toContainEqual({x: 8, y: 4, type: 'walk', kills: 0, in_danger: false}); // NE
});

it("should include the dwarf 'hurl' move", () => {
  var game = new_game();
  game.dwarf_controller.select_space(4, 1);
  game.dwarf_controller.move(6, 3);
  game.troll_controller.select_space(8, 8);
  game.troll_controller.move(9, 9);
  game.dwarf_controller.select_space(3, 2);
  game.dwarf_controller.move(6, 2);
  game.troll_controller.select_space(6, 6);
  game.troll_controller.move(6, 5);

  var space = game.board.space(6, 3);
  var move_calculator = new MoveCalculator(game.board, space, 'd');

  expect(move_calculator.moves).toContainEqual({x: 6, y: 5, type: 'hurl', kills: 1, in_danger: true});
});

it("should include the troll 'shove' move", () => {
  var game = new_game();
  game.dwarf_controller.select_space(4, 1);
  game.dwarf_controller.move(6, 3);

  var space = game.board.space(6, 6);
  var move_calculator = new MoveCalculator(game.board, space, 't');
  expect(move_calculator.moves).toContainEqual({x: 6, y: 4, type: 'shove', kills: 1, in_danger: false});
  expect(move_calculator.moves).toContainEqual({x: 6, y: 3, type: 'shove', kills: 1, in_danger: false});
});

it('should know that a troll move kills all dwarf neighbours', () => {
  var game = new_game();
  game.dwarf_controller.select_space(4, 1);
  game.dwarf_controller.move(7, 4);

  var space = game.board.space(7, 6);
  var move_calculator = new MoveCalculator(game.board, space, 't');
  expect(move_calculator.moves).toContainEqual({x: 7, y: 5, type: 'walk', kills: 1, in_danger: false});

  game.troll_controller.select_space(7, 8);
  game.troll_controller.move(7, 9);
  game.dwarf_controller.select_space(13, 4);
  game.dwarf_controller.move(8, 4);

  space = game.board.space(7, 6);
  move_calculator = new MoveCalculator(game.board, space, 't');
  expect(move_calculator.moves).toContainEqual({x: 7, y: 5, type: 'walk', kills: 2, in_danger: false});
});
