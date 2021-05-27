import Game from './models/game.js';

var game = new Game(
  {
    reporters: ['Canvas', 'Console'],
    dwarf_client: 'Manual',
    troll_client: 'Manual'
  }
);

window.game = game;
