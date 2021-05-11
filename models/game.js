class Game {
  constructor(attrs) {
    this.dwarves = [];
    this.trolls = [];
    this.turn = 0;
    this.current_side = 'd';
    this.board = new Board(this);
    this.scores = {
      d: this.dwarves.length,
      t: (this.trolls.length * 4)
    }
    // TODO
    this.previous_move = {
      from: {x: 0, y: 0},
      to: {x: 0, y: 0},
      type: 'walk',
      killed: 0,
      lost: 0
    }
    this.init_reporters(attrs);
  }

  init_reporters(attrs) {
    var game = this;
    game.reporters = []
    if (attrs.reporters) {
      attrs.reporters.forEach(
        function (reporter_name) {
          game.attach_reporter(reporter_name);
        }
      );
    }
  }

  attach_reporter(name) {
    this.reporters.push(new Reporters[name](this));
  }

  report(event, args) {
    this.reporters.forEach(
      function (reporter) {
        reporter[event](args);
      }
    )
  }

}