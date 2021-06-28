module.exports = class {
  constructor(controller, utils) {
    this.controller = controller;
    this.side = controller.side;
    this.utils = utils;
    this.troll_index = -1;
    // Correspond to indexed_trolls
    this.troll_info = [
      {attack: false, step: [-1, -1]}, //NW
      {attack: false, step: [0, -1]}, //N
      {attack: false, step: [1, -1]}, //NE
      {attack: false, step: [-1, 0]}, //W
      {attack: false, step: [1, 0]}, //E
      {attack: false, step: [-1, 1]}, //SW
      {attack: false, step: [0, 1]}, //S
      {attack: false, step: [1, 1]} //SE
    ]
    this.troll_index = 0;
  }

  turn() {
    var killing_moves = this.controller.killing_moves();
    if (killing_moves.length > 0) {
      this.controller.select_space(killing_moves[0].from.x, killing_moves[0].from.y);
      this.controller.move(killing_moves[0].to.x, killing_moves[0].to.y);
    } else {
      var space = this.controller.trolls()[this.troll_index % this.controller.trolls().length];
      this.troll_index += 1;
      var indexed_trolls = this.controller.indexed_trolls();
      var index = indexed_trolls.indexOf(
        indexed_trolls.find(troll => {
          return troll && troll.x == space.x && troll.y == space.y
        })
      );
      var troll_info = this.troll_info[index];
      var troll = this.controller.space_info(space.x, space.y);
      if (troll_info.attack) {
        this.attack(troll);
      } else {
        // Look one step towards the edge
        var move_target = {
          x: (troll.x + troll_info.step[0]),
          y: (troll.y + troll_info.step[1])
        }
        // If you can walk that way, go there
        if (troll.moves.some(move => move.x == move_target.x && move.y == move_target.y)) {
          this.controller.select_space(troll.x, troll.y);
          this.controller.move(move_target.x, move_target.y);
        } else {
          // Change to attack mode
          troll_info.attack = true;
          this.attack(troll);
        }
      }
    }
  }

  // troll is space_info
  // If there's no more moves in the step direction to take, just go towards the nearest dwarf
  attack(troll) {
    var target = troll.nearest_dwarf.pieces[0];
    var closest_move = this.utils.closest_to(troll.moves, target);
    this.controller.select_space(troll.x, troll.y);
    this.controller.move(closest_move.x, closest_move.y);
  }

  end_turn() {

  }

}
