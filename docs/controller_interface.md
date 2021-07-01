# Controller Interface

A controller is the component which will make requests of the board to allow
a player (human or computer) to interact with the game. It will implement the
contract below:

* `constructor(board, side, utils)` - utils is a link to ControllerUtils
* Board state:
  * `turn()` - Current turn of the game
  * `scores()` - The current score
  * `spaces()` - Every space, and what's in it
  * `space_info(x, y)` - Detailed information on any space on the board
  * `pieces()` - Convenience method, gets all pieces belonging to your current side  
  * `dwarfs()` - The location of every dwarf
  * `trolls()` - The location of every troll
  * `indexed_dwarfs()` - The location of every dwarf with a fixed index
  * `indexed_trolls()` - The location of every troll with a fixed index
  * `previous_move()` - What got moved to where last turn
  * `killing_moves()` - All moves which can kill one or more opponent
* For turns: 
  * `check_space(x, y)`- Find out what moves are available from a given space
  * `select_space(x, y)` - The player decides to move a piece at space
  * `check_move(x, y)` - Find out what will happen if you move to a place
  * `move(x, y)` - The player moves the current piece to the selected space
* Decision making:
  * `current_space` - Currently selected space (not a function)
  * `clear_space()` - Empties currently selected space
  * `declare(game_over)` - Say whether or not your player thinks no more progress can be made on the game
  * `opponent_declared()` - Has the opponent declared the game over?
* Utils class:
  * `utils.distance_between(source, target)` - The square distance between two objects which respond to x and y
  * `utils.farthest_from(spaces, target)` - From an array of spaces (with x and y), choose the farthest from target (with x and y) 
  * `utils.closest_to(spaces, target)` - From an array of spaces (with x and y), choose the closest to target (with x and y) 

Every game will have two controllers, dwarf and troll, belonging to two players, 
dwarf and troll.

## Board State

### turn()

Returns the current turn number.

```js
controller.turn();
// 52
```

### scores()

Returns the current score of the game.

```js
controller.scores();
/* 
  {
   dwarfs: 12, 
   trolls: 3,
   difference: 9,
   winning: 't'
 }  
*/
```

### spaces()

Returns an array of every space on the board and what's in it.

```js
controller.spaces();
/*
[
  {x, 5, y: 0, piece: 'd'},
  {x, 6, y: 0, piece: 'd'},
  {x, 6, y: 0, piece: null},
  ...
] 
 */
```

### space_info(x, y)

Detailed information on any space on the board.

```js 
space_info(6, 0);
/*
{
  x: 6,
  y: 0,
  piece: 'd',
  moves: [{x: 6, y: 1, type: 'walk', kills: 1, in_danger: false}, ...],
  safe_moves: [{x: 6, y: 1, type: 'walk', kills: 1, in_danger: false}, ...],
  nearest_dwarf: {distance: 1, pieces: [{x: 5, y: 0}]},
  nearest_troll: {distance: 6, pieces: [{x: 6, y: 6}]},
  in_danger: false
}
*/
```

* `x` and `y` are the coordinates of the space (same as passed in)
* `piece` denotes what piece, if any is on that space (can be 'd', 't' or null)
* `moves` is an array of move objects which show moves available from that space (will be empty if no piece is present)
* `safe_moves` is an array of move objects which show moves which can not then be taken in the following turn.
* `nearest_dwarf` is an object about the nearest dwarfs. `distance` is how far away they are (in a square distance), `pieces` is the coordinates of all dwarfs that far away.
* `nearest_troll` is an object about the nearest trolls. `distance` is how far away they are (in a square distance), `pieces` is the coordinates of all dwarfs that far away.
* `in_danger` is a boolean. If there were a member of the current side on that space, it could be killed by the opponent on the next turn.

Move attributes:

* `x` and `y` are the coordinates of the target of that move.
* `type` is the type of move which is taking place (can be 'walk', 'shove' or 'hurl').
* `kills` is the number of enemy pieces which would be killed if this move is carried out.
* `in_danger` is a boolean, which will be true if the piece making this move can be killed the following turn. 

### pieces()

Convenience method. Returns all the pieces belonging to the current side.

Equivalent of either `dwarfs()` or `trolls()`.

```js
// From dwarf client
controller.pieces();
/*
[
  {x: 5, y: 0},
  {x: 6, y: 0},
  {x: 8, y: 0},
  ...
]
*/
```

### dwarfs()

Returns an array of the position of every dwarf.

```js
controller.dwarfs();
/*
[
  {x: 5, y: 0},
  {x: 6, y: 0},
  {x: 8, y: 0},
  ...
]
*/
```

### trolls()

Returns an array of the position of every troll.

```js
controller.trolls();
/*
[
  {x: 6, y: 6},
  {x: 7, y: 6},
  {x: 8, y: 6},
  ...
]
*/
```

### indexed_dwarfs()

Returns the position of every dwarf on the board, with a fixed index.

This means that dwarf 7 will always be the same piece, unless that piece is taken.

```js
controller.indexed_dwarfs();
/*
[
  {x: 5, y: 0},
  {x: 6, y: 0},
  {x: 8, y: 0},
]
*/

// If the first two dwarfs are removed

controller.indexed_dwarfs();
/*
[
  null,
  null,
  {x: 8, y: 0},
]
*/
```

### indexed_trolls()

Returns the position of every troll on the board, with a fixed index.

This means that troll 7 will always be the same piece, unless that piece is taken.

```js
controller.indexed_trolls();
/*
[
  {x: 6, y: 6},
  {x: 7, y: 6},
  {x: 8, y: 6},
]
*/

// If the first two trolls are removed

controller.indexed_dwarfs();
/*
[
  null,
  null,
  {x: 8, y: 6},
]
*/
```

### previous_move()

What just happened?

```js
controller.previous_move();
/*
{
  from: {x: 6, y: 0},
  to: {x: 6, y: 9},
  type: 'walk',
  killed: 0,
  lost: 0      
}
 */
```

### killing_moves()

All moves which could currently kill one or more opponent.

```js
controller.killing_moves()
/*
  [
    {
      from: {x: 5, y: 6},
      to: {x: 7, y: 6},
      kills: 1
    }  
  ]
 */

// If we can, kill it
var killing_moves = this.controller.killing_moves();
if (killing_moves.length > 0) {
  this.controller.select_space(killing_moves[0].from.x, killing_moves[0].from.y);
  this.controller.move(killing_moves[0].to.x, killing_moves[0].to.y);
}
```

## For actions:

I expect these will be used in this order, but probably more than once.

### check_space(x, y)

List the moves available to the piece in the given space.

This is the same output as `space_info`, only it will return null if the space does not belong
to the current player.

```js
// Dwarf controlelr
controller.check_space(5, 0);
/*
{
  x: 6,
  y: 0,
  piece: 'd',
  moves: [{x: 6, y: 1, type: 'walk', kills: 1}, ...],
  safe_moves: [{x: 6, y: 1, type: 'walk', kills: 1, in_danger: false}, ...],
  nearest_dwarf: {distance: 1, pieces: [{x: 5, y: 0}]},
  nearest_troll: {distance: 6, pieces: [{x: 6, y: 6}]}
}
 */
```

Available types are:
* 'move'
* 'hurl' (dwarf only)
* 'shove' (troll only)

If the selected space is null, this will return null.

If the selected space does not have a moveable piece, it will return an empty array.

### select_space(x, y)

This selects a piece to move. This must be done before checking a move or moving the piece.

It will return a boolean, which is true if the selected space is a moveable piece (belonging
to the current player).

```js
controller.select_space(5, 0);
// true
controller.select_space(5, 5);
// false
```

### check_move(x, y)

Use after selecting a piece. x and y describe the space to move this piece to. This 
will return information on whether this is a valid move, and what will happen if it is 
selected.

```js
controller.select_space(6, 0);
// true
controller.check_move(6, 5);
/* {valid: true, type: 'move', kills: 0} */
```

### move(x, y)

Use after selecting a piece. If this is a valid move, this will carry out the move and end 
the current player's turn.

```js
controller.select_space(6, 0);
controller.move(9,9);
// false
controller.move(6, 5);
// true
```

This only returns true or false, any other results are seen via the reporters.

This can be called multiple times, but subsequent calls will negate previous calls.

If this is not called by the end of the turn, the game ends with an error.

## Utility functions:

### current_space

Returns the space which was selected in `select_space` for future reference.

```js
controller.select_space(6, 0);
controller.current_space
//{x: 6, y: 0, piece: 'd'}
```

Note: This is not a function

### clear_space()

This is a convenience method which empties the current_space variable and 
also reports the board state to reporters (so highlighted squares will disappear)

```js
controller.select_space(6, 0);
controller.current_space
//{x: 6, y: 0, piece: 'd'}
controller.clear_space();
controller.current_space
// null
```


### declare(game_over)

Thud often ends in an attritional state where neither side can make any progress.
The dwarfs are huddled together for defence, so the trolls can't get near, so they
don't try. The dwarfs can't launch an assault without breaking their defensive huddle,
so they don't try.

When this happens, both players can agree the game is over and the current score will
be treated as the final score. Use `declare(game_over)` to signal this intention.

```js
controller.declare(true);
```

You can also use this to retract your declaration that the game is over:

```js
controller.declare(false);
```

Note: If your opponent hasn't already declared the game over, you will still need to
make a valid move to end your turn, because your opponent might not agree that it's over.

### opponent_declared()

Returns a boolean of whether or not your opponent has declared the game over.

```js
controller.opponent_declared();
// true
```
