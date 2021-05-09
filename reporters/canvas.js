if (typeof Reporters == 'undefined') {
  Reporters = {}
}

Reporters['Canvas'] = class Canvas {

  static space_colours = ['lightgrey','darkgrey']

  constructor(board) {
    var reporter = this;
    reporter.board = board;
    reporter.space_size = 30;
    reporter.canvas = Utils.build_element(
      'canvas',
      {
        height: reporter.space_size * 15,
        width: reporter.space_size * 15,
        style: 'background-color: white;'
      }
    );
    reporter.context = reporter.canvas.getContext('2d');
    board.rows.forEach(
      function (row, row_index) {
        row.forEach(
          function (space, column_index) {
            reporter.draw_space(space, reporter);
          }
        )
      }
    );
    document.body.append(reporter.canvas);
  }

  draw_space(space, reporter) {
    if (space) {
      reporter.context.beginPath();
      reporter.context.rect(
        reporter.space_size * space.x,
        reporter.space_size * space.y,
        reporter.space_size,
        reporter.space_size
      );
      reporter.context.fillStyle = Reporters.Canvas.space_colours[space.colour_index];
      reporter.context.fill();
    }
  }
};
