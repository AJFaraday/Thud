const Game = require('./../src/models/game.js');

var started = new Date();
var game = new Game(
  {
    reporters: ['Console'],
    dwarf_client: 'dwarf/default/lucky_7',
    troll_client: 'troll/default/last_move'
  }
);
var finished = new Date();
var diff = finished - started;
console.log(`Finished in ${diff}`)
