const Game = require('./../src/models/game.js');

var game = new Game(
  {
    reporters: ['Console'],
    dwarf_client: 'Dummy',
    troll_client: 'Dummy'
  }
);

game.dwarf_controller.select_space(4,1);
game.dwarf_controller.move(10,7);
game.troll_controller.select_space(8,8);
game.troll_controller.move(11,8);
