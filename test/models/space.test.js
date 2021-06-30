const Game = require('../../src/models/game.js');
const Space = require('../../src/models/space');

function new_game() {
  return new Game(
    {
      reporters: [],
      dwarf_client: 'inert/dummy',
      troll_client: 'inert/dummy'
    }
  );
}

test('should have attributes', () => {
  var game = new_game();
  var space = game.board.space(4, 5);
  expect(space.game).toBe(game);
  expect(space.board).toBe(game.board);
  expect(space.x).toEqual(4);
  expect(space.y).toEqual(5);
  expect(space.colour_index).toEqual(1);
  space = game.board.space(4, 6);
  expect(space.colour_index).toEqual(0);
  space = game.board.space(3, 5);
  expect(space.colour_index).toEqual(0);
});

test('should build a dwarf if piece = d', () => {
  var game = new_game();
  var space = new Space(game, game.board, 5, 6, 'd');
  expect(space.piece.x).toEqual(6);
  expect(space.piece.y).toEqual(5);
  expect(space.piece.type).toEqual('d');
  expect(game.dwarfs).toContain(space.piece);
  expect(game.indexed_dwarfs).toContain(space.piece);
});

test('should build a troll if piece = t', () => {
  var game = new_game();
  var space = new Space(game, game.board, 5, 6, 't');
  expect(space.piece.x).toEqual(6);
  expect(space.piece.y).toEqual(5);
  expect(space.piece.type).toEqual('t');
  expect(game.trolls).toContain(space.piece);
  expect(game.indexed_trolls).toContain(space.piece);
});

test('should have 8 directions', () => {
  var game = new_game();
  var space = game.board.space(5, 6);

  expect(Object.keys(space.directions).length).toEqual(8);
  expect(space.directions.N).toBeDefined();
  expect(space.directions.N.opposite).toBeDefined();
});

test('should have neighbours', () => {
  var game = new_game();

  var space = game.board.space(5, 6);
  expect(space.neighbours.length).toEqual(8)

  space = game.board.space(2, 3);
  expect(space.neighbours.length).toEqual(5)
});

it('should be able to get N neighbours of type', () => {
  var game = new_game();

  var space = game.board.space(7, 5);
  expect(space.neighbours_of_type('t')).toEqual(3);
  expect(space.neighbours_of_type('d')).toEqual(0);
});

