const Game = require('../../src/models/game.js');
var game = new Game(
  {
    reporters: [],
    dwarf_client: 'inert/dummy',
    troll_client: 'inert/dummy'
  }
);

var space = game.board.space(5, 3);
var direction = space.directions.E;

test('has attributes', () => {
  expect(direction.board).toBe(game.board);
  expect(direction.x).toEqual(5);
  expect(direction.y).toEqual(3);
});

test('has correct step', () => {
  expect(space.directions.N.step).toEqual([0, -1]);
  expect(space.directions.NE.step).toEqual([1, -1]);
  expect(space.directions.E.step).toEqual([1, 0]);
  expect(space.directions.SE.step).toEqual([1, 1]);
  expect(space.directions.S.step).toEqual([0, 1]);
  expect(space.directions.SW.step).toEqual([-1, 1]);
  expect(space.directions.W.step).toEqual([-1, 0]);
  expect(space.directions.NW.step).toEqual([-1, -1]);
});

test('got the right spaces', () => {
  var coords = direction.spaces.map((s) => [s.x, s.y]);
  expect(coords).toEqual(
    [
      [5, 3],
      [6, 3],
      [7, 3],
      [8, 3],
      [9, 3],
      [10, 3],
      [11, 3],
      [12, 3]
    ]
  );
});

test('has a list of empty spaces', () => {
  var coords = direction.empty_spaces().map((s) => [s.x, s.y]);
  expect(coords).toEqual(
    [
      // Not the space itself
      [6, 3],
      [7, 3],
      [8, 3],
      [9, 3],
      [10, 3],
      [11, 3],
    ]
  );
});

test('knows how many dwarves are in a line', () => {
  var space = game.board.space(6, 0);
  var direction = space.directions.W;
  expect(direction.pieces_in_line('d')).toEqual(2);

  var space = game.board.space(3, 2);
  var direction = space.directions.W;
  expect(direction.pieces_in_line('d')).toEqual(1);

  var space = game.board.space(6, 3);
  var direction = space.directions.W;
  expect(direction.pieces_in_line('d')).toEqual(0);
});

test('knows how many trolls are in a line', () => {
  var space = game.board.space(8, 6);
  var direction = space.directions.W;
  expect(direction.pieces_in_line('t')).toEqual(3);

  var space = game.board.space(8, 7);
  var direction = space.directions.W;
  expect(direction.pieces_in_line('t')).toEqual(1);

  var space = game.board.space(6, 0);
  var direction = space.directions.W;
  expect(direction.pieces_in_line('t')).toEqual(0);
});