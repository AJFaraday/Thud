const Game = require('./../src/models/game.js');

var game = new Game(
  {
    reporters: ['Console'],
    dwarf_client: 'Dwarf/Lucky_7',
    troll_client: 'Troll/LastMove'
  }
);
