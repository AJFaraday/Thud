const Game = require('../../src/models/game.js');
const Board = require('../../src/models/board.js');
const Space = require('../../src/models/space.js');

function new_game() {
  return new Game(
    {
      reporters: [],
      dwarf_client: 'Dummy',
      troll_client: 'Dummy'
    }
  );
}

test('it should have an array of rows', () => {
  var board = new_game().board;
  expect(board.rows).toBeInstanceOf(Array);
  expect(board.rows[0]).toBeInstanceOf(Array);
  expect(board.rows[0][4]).toEqual(undefined);// blank space
  expect(board.rows[0][5]).toBeInstanceOf(Space);
  expect(board.rows[0][5].piece.type).toEqual('d');
  expect(board.rows[6][6].piece.type).toEqual('t');
});

test('should get space by coord', () => {
  var board = new_game().board;
  expect(board.space(99,99)).toEqual(null);
  expect(board.space(0,5).piece.type).toEqual('d');
  expect(board.space(6, 6).piece.type).toEqual('t');
});