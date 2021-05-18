class Direction {

  constructor(board, compass_point, x, y) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.step = this.get_step(compass_point.toUpperCase());
    this.spaces = this.get_spaces();
  }

  get_step(compass_point) {
    var step = [0, 0];
    if (compass_point.includes('S')) {
      step[1] = 1;
    } else if (compass_point.includes('N')) {
      step[1] = -1;
    }
    if (compass_point.includes('E')) {
      step[0] = 1;
    } else if (compass_point.includes('W')) {
      step[0] = -1;
    }
    return step;
  }

  get_spaces() {
    var x = this.x;
    var y = this.y;
    var spaces = [];

    var space = this.board.space(x, y);
    while (space) {
      spaces.push(space);
      x += this.step[0];
      y += this.step[1];
      space = this.board.space(x, y);
    }
    return spaces;
  }

  empty_spaces() {
    var found_spaces = [];
    var i = 1
    var space = this.spaces[i];
    while(space && !space.piece) {
      found_spaces.push(space);
      i += 1
      space = this.spaces[i];
    }
    return found_spaces;
  }

  // d or t in a line, including this one
  pieces_in_line(type) {
    var i = 0;
    var space = this.spaces[i];
    while(space && space.piece && space.piece.type == type) {
      i += 1
      var space = this.spaces[i];
    }
    return i;
  }

}
