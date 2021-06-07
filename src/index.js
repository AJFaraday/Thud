import Game from './models/game.js';

var game = new Game(
  {
    reporters: ['Canvas', 'Console'],
    //dwarf_client: 'dwarf/lucky_7',
    //troll_client: 'troll/last_move'
    troll_client: 'manual',
    dwarf_client: 'manual'
  }
);

window.game = game;
