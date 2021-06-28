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
  }

  report() {
    return {
      dwarf_client: this.dwarf_client,
      troll_info: this.troll_client,
      length: this.length,
      score: this.score,
      end_reason: this.end_reason
    }
  }

}

module.exports = Match;
