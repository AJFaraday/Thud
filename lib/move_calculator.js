class MoveCalculator {

  constructor(board, space, side) {
    this.board = board;
    this.space = space;
    this.side = side;
    if (space && space.piece && space.piece.type == side) {
      if (side == 'd') {
        this.moves = this.dwarf_moves();
      } else if (side == 't') {
        this.moves = this.troll_moves();
      } else {
        this.moves = [];
      }
    } else {
      this.moves = [];
    }
  }

  dwarf_moves() {
    var calculator = this;
    var moves = [];
    Object.values(calculator.space.directions).forEach(
      function(direction) {
        direction.empty_spaces().forEach(
          function(empty_space) {
            moves.push({x: empty_space.x, y: empty_space.y, type: 'walk'});
          }
        );
        var hurl_distance = direction.opposite.pieces_in_line('d');
        direction.spaces.slice(1, hurl_distance).forEach(
          function(space) {
            if(space.piece && space.piece.type == 't') {
              moves.push({x: space.x, y: space.y, type: 'hurl'});
            }
          }
        )
      }
    );
    return moves;
  }

  troll_moves() {
    var calculator = this;
    var moves = [];
    Object.values(calculator.space.directions).forEach(
      function(direction) {
        var empty_spaces = direction.empty_spaces();
        if(empty_spaces[0]) {
          var space = direction.empty_spaces()[0];
          moves.push(moves.push({x: space.x, y: space.y, type: 'walk'}));
        }
      }
    );
    // TODO include shove
    return moves;
  }


}