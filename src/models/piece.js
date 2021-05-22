class Piece {
  constructor(game, x, y, type) {
    this.game = game;
    this.type = type;
    this.x = x;
    this.y = y;
    if (type == 'd') {
      this.game.dwarves.push(this);
      this.game.indexed_dwarves.push(this);
    } else if (type == 't') {
      this.game.trolls.push(this);
      this.game.indexed_trolls.push(this);
    }
  }
}

module.exports = Piece;