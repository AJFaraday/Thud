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
      direction => {
        direction.empty_spaces().forEach(empty_space => moves.push({x: empty_space.x, y: empty_space.y, type: 'walk'}));
        var hurl_distance = direction.opposite.pieces_in_line('d');
        direction.spaces.slice(1, (hurl_distance + 1)).forEach(
          (space, index) => {
            if (space.piece && space.piece.type == 't' && calculator.space_between_is_empty(direction, index)) {
              moves.push({x: space.x, y: space.y, type: 'hurl'});
            }
          }
        )
      }
    );
    return moves;
  }

  space_between_is_empty(direction, index) {
    return direction.spaces.slice(1, (index + 1)).every(space => !space.peice);
  }

  troll_moves() {
    var calculator = this;
    var moves = [];
    calculator.space.neighbours.filter(
      neighbour => !neighbour.piece
    ).forEach(
      neighbour => moves.push(moves.push({x: neighbour.x, y: neighbour.y, type: 'walk'}))
    );

    Object.values(calculator.space.directions).forEach(
      (direction) => {
        var shove_distance = direction.opposite.pieces_in_line('t');
        if(shove_distance > 1) {
          direction.spaces.slice(1, shove_distance).forEach(
            (space, index) => {
              if (
                space.piece && space.piece.type == 'd' ||
                (
                  calculator.space_between_is_empty(direction, index) &&
                  calculator.space_has_dwarf_neighours(space)
                )
              ) {
                moves.push({x: space.x, y: space.y, type: 'shove'});
              }
            }
          );
        }
      }
    );
    return moves;
  }


  space_has_dwarf_neighours(space) {
    return space.neighbours.some(neighbour => neighbour.piece && neighbour.piece.type == 'd');
  }
}