if (typeof Clients == 'undefined') {
  Clients = {}
}

Clients['Manual'] = class Manual {
  constructor(game, controller) {
    this.game = game;
    this.side = controller;
  }

  turn() {

  }

}