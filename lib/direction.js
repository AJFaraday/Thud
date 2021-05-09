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

}
