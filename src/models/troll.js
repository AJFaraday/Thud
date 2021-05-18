class Troll {
  constructor(game, x, y) {
    this.game = game;
    this.game.trolls.push(this);
    this.x = x;
    this.y = y;
    this.type = 't';
  }
}