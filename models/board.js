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
      function (row, row_index) {
        board.rows[row_index] = [];
        row.split('').forEach(
          function (char, column_index) {
            if (char != '#') {
              board.rows[row_index][column_index] = new Space(board.game, board, row_index, column_index, char);
            }
          }
        )
      }
    )
    // It's important this is after all spaces are initialised!
    board.rows.forEach(
      function (row) {
        row.forEach(
          function (space) {
            space.get_directions();
          }
        )
      }
    )
  }

  space(x, y) {
    if (this.rows[y]) {
      return this.rows[y][x];
    } else {
      return null;
    }
  }

  spaces() {
    var board = this;
    if (typeof board.all_spaces == 'object') {
      return board.all_spaces;
    } else {
      board.all_spaces = [];
      board.rows.forEach(
        function(row) {
          board.all_spaces = board.all_spaces.concat(
            row.filter(Boolean)
          );
        }
      );
      return board.all_spaces;
    }
  }


}