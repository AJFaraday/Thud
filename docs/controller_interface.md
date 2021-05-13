# Controller Interface

A controller is the component which will make requests of the board to allow
a player (human or computer) to interact with the game. It will implement the
contract below:

* `constructor(board, side)`
* Board state:
  * `turn()` - Current turn of the game
  * `scores()` - The current score
  * `spaces()` - Every space, and what's in it
  * `dwarves()` - The location of every dwarf
  * `trolls()` - The location of every troll
  * `previous_move()` - What got moved to where last turn
* For turns: 
  * `check_space(x, y)`- Find out what moves are available from a given space
  * `select_space(x, y)` - The player decides to move a piece at space.
  * `check_move(x, y)` - Find out what will happen if you move to a place
  * `move(x, y)` - The player moves the current piece to the selected space.
* Utility:
  * `current_space` - Currently selected space (not a function)
  * `clear_space()` - Empties currently selected space

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
controller.score();
// {D: 12, T: 3}
```

### spaces()

Returns an array of every space on the board and what's in it.

```js
controller.spaces();
/*
[
  {x, 5, y: 0, piece: 'D'},
  {x, 6, y: 0, piece: 'D'},
  {x, 6, y: 0, piece: null},
  ...
] 
 */
```

### dwarves()

Returns an array of the position of every dwarf.

```js
controller.dwarves();
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

## For actions:

I expect these will be used in this order, but probably more than once.

### check_space(x, y)

List the moves available to the piece in the given space.

```js
controller.check_space(5, 0);
/*
[
  {x: 6, y: 0, type: 'hurl'}
  {x:5, y: 1, type: 'move'},
  ...
]
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
/* {valid: true, type: 'move', kills: 0, loses: 1} */
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
