class Piece {
  constructor(game, x, y, type) {
    this.game = game;
    this.type = type;
    this.x = x;
    this.y = y;
    if (this.is_dwarf()) {
      this.game.dwarfs.push(this);
      this.game.indexed_dwarfs.push(this);
    } else if (this.is_troll()) {
      this.game.trolls.push(this);
      this.game.indexed_trolls.push(this);
    }
  }

  is_dwarf() {
    return this.type == 'd';
  }

  is_troll() {
    return this.type == 't';
  }
}

module.exports = Piece;