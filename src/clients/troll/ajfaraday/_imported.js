module.exports = class {
  constructor(controller, utils) {
    this.controller = controller;
    this.side = controller.side;
    this.utils = utils;
  }

  turn() {
    var target = this.controller.previous_move().to;
    var troll = this.controller.space_info(target.x, target.y).nearest_troll.pieces[0];
    this.controller.select_space(troll.x, troll.y);
    var space_info = this.controller.check_space(troll.x, troll.y);
    var closest_move = this.utils.closest_to(space_info.moves, target);
    this.controller.move(closest_move.x, closest_move.y);
  }

  end_turn() {
    var scores = this.controller.scores();
    this.controller.declare(scores.winning == 't');
  }

}
