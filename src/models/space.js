const Direction = require('./../lib/direction.js');
const Dwarf = require('./dwarf.js');
const Troll = require('./troll.js');

class Space {

  static direction_list = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  constructor(game, board, row_index, column_index, piece) {
    this.game = game;
    this.board = board;
    this.x = column_index;
    this.y = row_index;
    this.colour_index = ((this.x + this.y) % 2);
    switch (piece) {
      case 'd':
        this.piece = new Dwarf(this.game, this.x, this.y);
        break;
      case 't':
        this.piece = new Troll(this.game, this.x, this.y);
        break;
    }
  }

  get_directions() {
    var space = this;
    space.directions = {};
    Space.direction_list.forEach(
      compass_point => {
        space.directions[compass_point] = new Direction(
          space.board,
          compass_point,
          space.x,
          space.y
        )
      }
    );
    Object.values(space.directions).forEach(
       (direction, index) => {
        direction.opposite = space.directions[Space.direction_list[(index + 4) % 8]];
      }
    );
  }

  get_neighbours() {
    var space = this;
    space.neighbours = [];
    Object.values(this.directions).forEach(
      direction => {
        if(direction.spaces[1]) {
          space.neighbours.push(direction.spaces[1]);
        }
      }
    );
  }

}

module.exports = Space;
