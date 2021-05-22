const Space = require('./space.js'); 

class Board {

  static layout = [
    "#####dd dd#####",
    "####d     d####",
    "###d       d###",
    "##d         d##",
    "#d           d#",
    "d             d",
    "d     ttt     d",
    "      t#t      ",
    "d     ttt     d",
    "d             d",
    "#d           d#",
    "##d         d##",
    "###d       d###",
    "####d     d####",
    "#####dd dd#####"
  ]

  constructor(game) {
    var board = this;
    board.game = game;
    board.build_spaces();
    this.reporters = [];
  }

  build_spaces() {
    var board = this;
    board.rows = [];
    Board.layout.forEach(
      (row, row_index) => {
        board.rows[row_index] = [];
        row.split('').forEach(
          (char, column_index) => {
            if (char != '#') {
              board.rows[row_index][column_index] = new Space(board.game, board, row_index, column_index, char);
            }
          }
        )
      }
    );
    // It's important this is after all spaces are initialised!
    board.rows.forEach(
      row => {
        row.forEach(space => {
          space.get_directions();
          space.get_neighbours();
        })
      }
    );

    board.spaces = [];
    board.rows.forEach(
      row => board.spaces = board.spaces.concat(row.filter(Boolean))
    );
  }

  space(x, y) {
    return this.rows[y] ? this.rows[y][x] : null;
  }


}

module.exports = Board;