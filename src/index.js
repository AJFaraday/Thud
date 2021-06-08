import Game from './models/game.js';
import Clients from './clients.js';

var game = new Game(
  {
    reporters: ['Canvas', 'Console'],
    //dwarf_client: 'dwarf/lucky_7',
    //troll_client: 'troll/last_move'
    troll_client: 'manual',
    dwarf_client: 'manual',
    delay: 0
  }
);

/*
game.reinit('dwarf/lucky_7', 'troll/last_move', 100)
 */

window.game = game;
window.Clients = Clients
