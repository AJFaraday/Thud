import Game from './models/game.js';
import Clients from './clients.js';
import Modal from './lib/modal.js';

var game = new Game(
  {
    reporters: ['Canvas', 'Console'],
    //dwarf_client: 'dwarf/default/keep_away',
    //troll_client: 'troll/default/last_move',
    troll_client: 'inert/manual',
    dwarf_client: 'inert/manual',
    delay: 100
  }
);


//game.reinit('dwarf/default/keep_away', 'troll/default/spread_out', 50)


window.Clients = Clients;
window.modal = new Modal(game)
window.game = game;
