const Game = require('../../src/models/game.js');

function new_game() {
  return new Game(
    {
      reporters: [],
      dwarf_client: 'Dummy',
      troll_client: 'Dummy'
    }
  );
}

test('turn() returns the current turn number', () => {
  var game = new_game();
  expect(game.dwarf_controller.turn()).toEqual(1);

  game.dwarf_controller.select_space(4, 1);
  game.dwarf_controller.move(8, 5);

  expect(game.troll_controller.turn()).toEqual(2);
})

test('should return the current scores', () => {
  var game = new_game();
  expect(game.dwarf_controller.scores()).toEqual(
    {
      dwarves: 32,
      trolls: 32,
      difference: 0,
      winning: '?'
    }
  );

  game.dwarf_controller.select_space(6, 0);
  game.dwarf_controller.move(6, 5);
  game.troll_controller.select_space(6, 6);
  game.troll_controller.move(6, 5);

  expect(game.dwarf_controller.scores()).toEqual(
    {
      dwarves: 31,
      trolls: 32,
      difference: 1,
      winning: 't'
    }
  );
});

it("should return spaces (not sure why you'd want to)", () => {
  var game = new_game();
  expect(game.dwarf_controller.spaces()).toBeInstanceOf(Array);
  // first space, first dwarf
  expect(game.dwarf_controller.spaces()[0]).toEqual({x: 5, y: 0, piece: 'd'});
  // first empty space
  expect(game.dwarf_controller.spaces()[2]).toEqual({x: 7, y: 0, piece: null});
  // first troll
  expect(game.dwarf_controller.spaces()[66]).toEqual({x: 6, y: 6, piece: 't'});
});

it('should present detailed information on a specific space', () => {
  var game = new_game();
  var space_info = game.dwarf_controller.space_info(5, 0);
  expect(space_info).toBeInstanceOf(Object);
  expect(space_info.x).toEqual(5);
  expect(space_info.y).toEqual(0);
  expect(space_info.piece).toEqual('d');
  expect(space_info.moves).toBeInstanceOf(Array);
  expect(space_info.moves.length).toEqual(21);
  expect(space_info.moves[0]).toEqual({x: 6, y: 1, type: 'walk', kills: 0});
  expect(space_info.nearest_dwarf).toBeInstanceOf(Object);
  expect(space_info.nearest_dwarf.distance).toEqual(1);
  expect(space_info.nearest_dwarf.pieces).toBeInstanceOf(Array);
  expect(space_info.nearest_dwarf.pieces.length).toEqual(2);
  expect(space_info.nearest_dwarf.pieces[0]).toEqual({x: 6, y: 0});
  expect(space_info.nearest_troll).toBeInstanceOf(Object);
  expect(space_info.nearest_troll.distance).toEqual(6);
  expect(space_info.nearest_troll.pieces).toBeInstanceOf(Array);
  expect(space_info.nearest_troll.pieces.length).toEqual(3);
  expect(space_info.nearest_troll.pieces[0]).toEqual({x: 8, y: 6});
});

test('should return all dwarves', () => {
  var game = new_game();
  var dwarves = game.dwarf_controller.dwarves();
  expect(dwarves).toBeInstanceOf(Array);
  expect(dwarves.length).toEqual(32);
  expect(dwarves[0]).toEqual({x: 5, y: 0});
  game.remove_piece(game.board.space(5, 0));
  var dwarves = game.dwarf_controller.dwarves();
  expect(dwarves[0]).toEqual({x: 6, y: 0});
});

test('should return all trolls', () => {
  var game = new_game();
  var trolls = game.dwarf_controller.trolls();
  expect(trolls).toBeInstanceOf(Array);
  expect(trolls.length).toEqual(8);
  expect(trolls[0]).toEqual({x: 6, y: 6});
  game.remove_piece(game.board.space(6, 6));
  var trolls = game.dwarf_controller.trolls();
  expect(trolls[0]).toEqual({x: 7, y: 6});
});

test('should return all dwarves (indexed)', () => {
  var game = new_game();
  var dwarves = game.dwarf_controller.indexed_dwarves();
  expect(dwarves).toBeInstanceOf(Array);
  expect(dwarves.length).toEqual(32);
  expect(dwarves[0]).toEqual({x: 5, y: 0});
  game.remove_piece(game.board.space(5, 0));
  var dwarves = game.dwarf_controller.indexed_dwarves();
  expect(dwarves[0]).toBeNull();
});

test('should return all trolls (indexed)', () => {
  var game = new_game();
  var trolls = game.dwarf_controller.indexed_trolls();
  expect(trolls).toBeInstanceOf(Array);
  expect(trolls.length).toEqual(8);
  expect(trolls[0]).toEqual({x: 6, y: 6});
  game.remove_piece(game.board.space(6, 6));
  var trolls = game.dwarf_controller.indexed_trolls();
  expect(trolls[0]).toBeNull();
});
