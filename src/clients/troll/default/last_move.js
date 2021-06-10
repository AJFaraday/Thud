module.exports = class {
  constructor(controller) {
    this.controller = controller;
    this.side = controller.side;
  }

  turn() {
    var target = this.controller.previous_move().to;
    var troll = this.controller.space_info(target.x, target.y).nearest_troll.pieces[0];
    this.controller.select_space(troll.x, troll.y);
    var moves = this.controller.check_space(troll.x, troll.y);
    moves.forEach((move) => {
      move.distance = (Utils.distance_between(move, target));
    });
    var closest_move = moves.sort((a,b) => {return a.distance - b.distance})[0];
    this.controller.move(closest_move.x, closest_move.y);
  }

  end_turn() {
    var scores = this.controller.scores();
    this.controller.declare(scores.winning == 't');
  }

}
