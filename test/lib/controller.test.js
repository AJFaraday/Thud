const Game = require('../../src/models/game.js');

function new_game() {
  return new Game(
    {
      reporters: [],
      dwarf_client: 'inert/dummy',
      troll_client: 'inert/dummy'
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

test('should return the previous move', () => {
  var game = new_game();
  expect(game.dwarf_controller.previous_move()).toEqual(
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

  expect(game.troll_controller.previous_move()).toEqual(
    {
      side: 'd',
      from: {x: 4, y: 1},
      to: {x: 8, y: 5},
      type: 'walk',
      killed: 0
    }
  );
});

test('should check a chosen space and return avaialble moves', () => {
  var game = new_game();
  var moves = game.dwarf_controller.check_space(5, 0);
  expect(moves).toBeInstanceOf(Array);
  expect(moves[0]).toEqual({x: 6, y: 1, type: 'walk', kills: 0});
  expect(game.dwarf_controller.checked_space).toEqual({x: 5, y: 0, moves: moves});

  // Doesn't return moves for a space which isn't a dwarf
  moves = game.dwarf_controller.check_space(6, 6);
  expect(moves).toBeInstanceOf(Array);
  expect(moves).toHaveLength(0);
  expect(game.dwarf_controller.checked_space).toEqual({x: 6, y: 6, moves: []});
});

test("should select a space if it's one of yours, or clear the selected space otherwise", () => {
  var game = new_game();
  expect(game.dwarf_controller.select_space(5, 0)).toBeTruthy();
  expect(game.dwarf_controller.current_space.x).toEqual(5);
  expect(game.dwarf_controller.current_space.y).toEqual(0);
  expect(game.dwarf_controller.select_space(5, 5)).toBeFalsy();
  expect(game.dwarf_controller.current_space).toBeNull();
});

test('should check if the selected piece can move to a space', () => {
  var game = new_game();
  expect(game.dwarf_controller.select_space(5, 0)).toBeTruthy();
  expect(game.dwarf_controller.check_move(5, 1)).toEqual(
    {valid: true, type: 'walk', kills: 0, targets: []}
  );
  expect(game.dwarf_controller.check_move(7, 1)).toEqual(
    {valid: false, type: null, kills: 0, targets: []}
  );
  // Move a dwarf into danger
  game.dwarf_controller.select_space(5, 0);
  game.dwarf_controller.move(5, 6);
  expect(game.troll_controller.select_space(6, 6)).toBeTruthy();
  expect(game.troll_controller.check_move(5, 1)).toEqual(
    {valid: false, type: null, kills: 0, targets: []}
  )
  expect(game.troll_controller.check_move(5, 5)).toEqual(
    {valid: true, type: 'walk', kills: 1, targets: [{x: 5, y: 6}]}
  );
  expect(game.troll_controller.check_move(4, 6)).toEqual(
    {valid: true, type: 'shove', kills: 1, targets: [{x: 5, y: 6}]}
  );

  // Move more dwarves into danger
  game.troll_controller.select_space(8, 8);
  game.troll_controller.move(9, 9);
  game.dwarf_controller.select_space(3, 2);
  game.dwarf_controller.move(6, 5);

  expect(game.troll_controller.select_space(6, 6)).toBeTruthy();
  expect(game.troll_controller.check_move(5, 5)).toEqual(
    {valid: true, type: 'walk', kills: 2, targets: [{x: 6, y: 5}, {x: 5, y: 6}]}
  );
});


test('should move the selected piece', () => {
  var game = new_game();
  // invalid move
  game.dwarf_controller.select_space(5, 0);
  game.dwarf_controller.move(6, 2);
  expect(game.board.space(5, 0).piece).not.toBeUndefined();
  expect(game.board.space(6, 2).piece).toBeUndefined();
  // valid move
  game.dwarf_controller.select_space(5, 0);
  game.dwarf_controller.move(5, 6);
  expect(game.board.space(5, 0).piece).toBeNull();
  expect(game.board.space(5, 6).piece).not.toBeUndefined();
  expect(game.board.space(5, 6).piece.type).toEqual('d');
  //Troll turn
  game.troll_controller.select_space(6, 6);
  // invalid move
  game.troll_controller.move(7, 2);
  expect(game.board.space(6, 6).piece).not.toBeUndefined();
  expect(game.board.space(7, 2).piece).toBeUndefined();
  // valid move
  game.troll_controller.select_space(6, 6);
  game.troll_controller.move(5, 5);
  expect(game.board.space(6, 6).piece).toBeNull();
  expect(game.board.space(5, 5).piece).not.toBeUndefined();
  expect(game.board.space(5, 5).piece.type).toEqual('t');
  // it killed the dwarf
  expect(game.board.space(7, 2).piece).toBeUndefined();
  expect(game.dwarves.length).toEqual(31);
});

test("should clear the expected space", () => {
  var game = new_game();
  // If clear space is called
  game.dwarf_controller.select_space(5, 0);
  expect(game.dwarf_controller.current_space).toBeInstanceOf(Object);
  game.dwarf_controller.clear_space();
  expect(game.dwarf_controller.current_space).toBeNull();
  // If an invalid move is checked
  game.dwarf_controller.select_space(5, 0);
  expect(game.dwarf_controller.current_space).toBeInstanceOf(Object);
  game.dwarf_controller.check_move(9, 9);
  expect(game.dwarf_controller.current_space).not.toBeNull();
  // If an invalid move is attempted
  game.dwarf_controller.select_space(5, 0);
  expect(game.dwarf_controller.current_space).toBeInstanceOf(Object);
  game.dwarf_controller.move(9, 9);
  expect(game.dwarf_controller.current_space).toBeNull();
});

test("should allow the client to declare the game is over", () => {
  var game = new_game();
  game.dwarf_controller.declare(true);
  expect(game.dwarf_controller.declared).toBeTruthy();
  game.dwarf_controller.select_space(5, 0);
  game.dwarf_controller.move(5, 6);
  expect(game.troll_controller.opponent_declared()).toBeTruthy();
  game.troll_controller.declare(true);
  // Game ends, stops calling turn()
  game.swap_side();
  expect(game.dwarf_controller.opponent_declared()).toBeTruthy();
});