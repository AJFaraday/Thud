const Game = require('./../src/models/game.js');

var game = new Game(
  {
    reporters: ['Console'],
    dwarf_client: 'Dummy',
    troll_client: 'Dummy'
  }
);

console.log(game.dwarf_controller.space_info(6, 2).nearest_dwarf);