class Tournament {
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
    console.log(`${this.game.dwarf_client_name} vs. ${this.game.troll_client_name}`);
    var score = this.game.get_score();
    var winner = ((score.winning == 'd') ? this.game.dwarf_client_name : this.game.troll_client_name);
    if (score.winning == '?') {
      winner = 'nobody';
    }
    console.log(`${winner} wins by ${score.difference} (${args.reason}, turn ${this.game.turn_number})`);
    console.log('');
  }

}

module.exports = Tournament;
