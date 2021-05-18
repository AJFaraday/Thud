class Console {
  constructor(game) {
    this.game = game;
    this.board = game.board;
  }

  // Reports the current state of the board
  // this.board.spaces
  board_state({}) {
    // ignored
  }

  // It's the start of a player's turn
  // args.side
  // args.turn
  turn_starts(args) {
    console.log(`Turn ${args.turn} starts: ${this.get_side(args.side)} to move`);
  }

  // The player is thinking about moving from this space
  // In the UI, this is a mouse hover, before a space is selected.
  // args.x
  // args.y
  highlight_space(args) {
    // ignored
  }

  // The player has decided to move this piece.
  // In the UI, this is a click.
  // args.x
  // args.y
  select_space(args) {
    //ignored
  }

  // The player is thinking of moving the piece from the selected space to this one.
  // In the UI, it's a mouse hover.
  // args.x
  // args.y
  highlight_move(args) {
    // ignored
  }

  // The player makes a move.
  // In the UI, it's a click when a space is selected.
  // args.side
  // args.from.x
  // args.from.y
  // args.to.x
  // args.to.y
  move(args) {
    console.log(`${this.get_side(args.side)} moves from ${args.from.x}:${args.from.y} to ${args.to.x}:${args.to.y}`);
  }

  // A piece has taken another piece (takes place after a move)
  // args.x
  // args.y
  // args.side
  piece_taken(args) {
    console.log(`${this.get_side(args.side)} taken at ${args.x}:${args.y}`);
  }

  // Someone's earned soem points
  // this.game.get_score()
  score(args) {
    var score = this.game.get_score();
    console.log(`The score is now dwarves: ${score.dwarves}, trolls: ${score.trolls}... ${this.get_side(score.winning)} are winning by ${score.difference}`);
  }

  // The game's over, awww.
  // args.reason
  // this.game.get_score()
  game_ended(args) {
    var score = this.game.get_score();
    console.log(`Game over! ${args.reason}! ${this.get_side(score.side)} wins by ${score.difference}`)
  }

  get_side(side) {
    if (side == 'd') {
      return 'dwarves'
    } else if (side == 't') {
      return 'trolls'
    } else {
      return 'nobody'
    }
  }

}

module.exports = Console;