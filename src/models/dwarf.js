class Dwarf {
  constructor(game, x, y) {
    this.game = game;
    this.game.dwarves.push(this);
    this.x = x;
    this.y = y;
    this.type = 'd';
  }
}

module.exports = Dwarf;