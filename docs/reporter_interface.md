# Reporter Interface

Each game board can have one or more reporters attached. These will respond 
to the interface below and implement varoius methods of reporting the progress 
of the game either to a user or an automated game runner.

* `constructor(board)`
* `board_state()`
* `turn starts({side: 'D'})` - Side is 'D' or 'T'
* `highlight_space({x: 10, y: 10})`
* `select_space({x: 10, y: 10})`
* `highlight_move({x: 10, y: 10})`
* `move({start: {x:10, y: 10}, end: {x:11, y: 10}})`
* `piece_taken({taken: {x: 10, y: 10}, by: {x: 11, y:10}})`
* `score_changed({side: 'D'})` - Get score from `board` object.
* `game_ended({reason: 'timeout'})`

Reporters can ignore any or all of the above events by implementing empty functions,
but they must implement the function.

Likely reporter classes include:

* `Canvas` - To the web UI
* `Console` - Textual progress of the game
* `Log` - Probably the same as Console, but saved to a file.
* `Scoreboard` - adds the match result to a json file of matches and scores.

Dummy Reporter class

```js
if (typeof Reporters == 'undefined') {
  Reporters = {}
}

Reporters['Dummy'] = class Dummy {
  constructor(board) {
    this.board = board;
  }
  
  // Reports the current state of the board
  // this.board.spaces
  board_state() {
    
  }

  // It's the start of a player's turn
  // attrs.side
  turn_starts(args) {
  
  }

  // The player is thinking about moving from this space
  // In the UI, this is a mouse hover, before a space is selected.
  // args.x
  // args.y
  highlight_space(args) {
  
  }

  // The player has decided to move this piece.
  // In the UI, this is a click.
  // args.x
  // args.y
  select_space(args) {

  }
  
  // The player is thinking of moving the piece from the selected space to this one.
  // In the UI, it's a mouse hover.
  // args.x
  // args.y
  highlight_move(args) {
    
  }

  // The player makes a move.
  // In the UI, it's a click when a space is selected.
  // args.x
  // args.y
  move(args) {
    
  }
  
  // A piece has taken another piece (takes place after a move)
  // args.taken.x
  // args.taken.y
  // args.by.x
  // args.by.y
  piece_taken(args) {
    
  }
  
  // Someone's earned soem points
  // args.side
  // this.board.scores[args.side]
  score_changed(args) {
    
  }
  
  // The game's over, awww.
  //args.reason
  game_ended(args) {
    
  }
  
}
```