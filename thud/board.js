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

  constructor() {
    var board = this;
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
              board.rows[row_index][column_index] = new Space(board, row_index, column_index);
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

  attach_reporter(name) {
    this.reporters.push(new Reporters[name](this));
  }

  report(event, attrs) {
    this.reporters.forEach(
      function (reporter) {
        reporter[event](attrs);
      }
    )
  }

  space(x, y) {
    if (this.rows[x]) {
      return this.rows[x][y];
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