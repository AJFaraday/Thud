import Game from './models/game.js';
import Controller from './lib/controller.js'

console.log(Game);


game = new Game(
  {
    reporters: ['Canvas', 'Console'],
    dwarf_client: 'Manual',
    troll_client: 'Manual'
  }
);
game.report('score');
