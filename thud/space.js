class Space {

  static direction_list = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  constructor(board, row_index, column_index) {
    this.board = board;
    this.x = column_index;
    this.y = row_index;
    this.colour_index = ((this.x + this.y) % 2);
  }


  get_directions() {
    var space = this;
    space.directions = {};
    Space.direction_list.forEach(
      function(compass_point) {
        space.directions[compass_point] = new Direction(
          space.board,
          compass_point,
          space.x,
          space.y
        )
      }
    );
    Object.values(space.directions).forEach(
      function(direction, index) {
        direction.opposite = space.directions[Space.direction_list[(index + 4) % 8]];
      }
    )
  }

}