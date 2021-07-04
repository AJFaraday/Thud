const Game = require('./game.js');

class Match {

  constructor(dwarf_client, troll_client) {
    this.dwarf_client = dwarf_client;
    this.troll_client = troll_client;
  }

  run() {
    this.game = new Game(
      {
        reporters: ['Tournament'],
        dwarf_client: this.dwarf_client,
        troll_client: this.troll_client
      }
    );
    this.length = this.game.turn_number;
    this.score = this.game.get_score();
    this.end_reason = this.game.end_reason;
    if (this.score.winning == 't') {
      this.sort_score = this.score.difference;
    } else {
      this.sort_score = this.score.difference * -1;
    }
  }

  report() {
    return {
      dwarf_client: this.dwarf_client,
      troll_client: this.troll_client,
      length: this.length,
      score: this.score,
      end_reason: this.end_reason,
      sort_score: this.sort_score
    }
  }

}

module.exports = Match;
