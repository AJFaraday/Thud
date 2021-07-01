# Reporter Interface

Each game board can have one or more reporters attached. These will respond 
to the interface below and implement varoius methods of reporting the progress 
of the game either to a user or an automated game runner.

* `constructor(board)`
* `board_state({})`
* `turn starts({side: 'd', turn: 1})`
* `highlight_space({x: 10, y: 10)`
* `select_space({x: 10, y: 10})`
* `highlight_move({x: 10, y: 10, type: 'walk'})`
* `move({side: 't', from: {x:10, y: 10}, to: {x:11, y: 10}})`
* `piece_taken({taken: {x: 10, y: 10}, side: 'd')`
* `score({})`
* `player_declared({side: 't', game_over: true})`  
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
  constructor(game) {
    this.game = game;
    this.board = game.board;
  }
  
  // Reports the current state of the board
  // this.board.spaces
  board_state({}) {
    
  }

  // It's the start of a player's turn
  // args.side
  // args.turn
  turn_starts(args) {
  
  }

  // The player is thinking about moving from this space
  // In the UI, this is a mouse hover, before a space is selected.
  // args.x
  // args.y
  // args.moves
  // args.in_danger
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
  // args.side
  // args.from.x
  // args.from.y
  // args.to.x
  // args.to.y
  move(args) {
    
  }
  
  // A piece has taken another piece (takes place after a move)
  // args.x
  // args.y
  // args.side
  piece_taken(args) {
    
  }
  
  // Someone's earned soem points
  // this.game.get_score()
  score(args) {
    
  }
  
  // A player has declared that the game is over (or retracted that declaration
  // args.side
  // args.game_over
  player_declared(args) {
    
  }
  
  // The game's over, awww.
  //args.reason
  // this.game.get_score()
  game_ended(args) {
    
  }
  
}
```