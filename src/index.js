import Game from './models/game.js';
import Clients from './clients.js';

console.log(Clients)

var game = new Game(
  {
    reporters: ['Canvas', 'Console'],
    dwarf_client: 'Manual',
    troll_client: 'Troll/LastMove'
  }
);

window.game = game;
