import Game from './models/game.js';
import Clients from './clients.js';
import Modal from './lib/modal.js';

var game = new Game(
  {
    reporters: ['Canvas', 'Console'],
    //dwarf_client: 'dwarf/default/lucky_7',
    //troll_client: 'troll/default/last_move',
    troll_client: 'inert/manual',
    dwarf_client: 'inert/manual',
    delay: 0
  }
);

/*
game.reinit('dwarf/lucky_7', 'troll/last_move', 100)
 */

window.Clients = Clients;
window.modal = new Modal(game)
//window.modal.show_form()
window.game = game;
