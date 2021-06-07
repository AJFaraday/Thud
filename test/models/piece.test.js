const Game = require('../../src/models/game.js');
function new_game() {
  return new Game(
    {
      reporters: [],
      dwarf_client: 'dummy',
      troll_client: 'dummy'
    }
  );
}

test('should place dwarf based on map', () => {
  var game = new_game();
  var piece = game.board.space(5,0).piece;
  expect(piece.game).toBe(game);
  expect(piece.x).toBe(5);
  expect(piece.y).toBe(0);
  expect(piece.type).toEqual('d');
});

test('should place troll based on map', () => {
  var game = new_game();
  var piece = game.board.space(6,6).piece;
  expect(piece.game).toBe(game);
  expect(piece.x).toBe(6);
  expect(piece.y).toBe(6);
  expect(piece.type).toEqual('t');
});

test('should add a dwarf to indexed_dwarves and dwarves', () => {
  var game = new_game();
  var piece = game.board.space(5,0).piece;
  expect(game.dwarves).toContain(piece);
  expect(game.indexed_dwarves).toContain(piece);
});

test('should add a dwarf to indexed_dwarves and dwarves', () => {
  var game = new_game();
  var piece = game.board.space(6,6).piece;
  expect(game.trolls).toContain(piece);
  expect(game.indexed_trolls).toContain(piece);
});