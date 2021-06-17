module.exports = class {
  constructor(controller, utils) {
    this.controller = controller;
    this.side = controller.side;
    this.utils = utils;
  }

  turn() {
    // TODO Look for killing move first. then go closest and escape
    var closest_dwarf = this.get_closest_dwarf();
    // Go through it's moves, find the one where the nearest troll is farthest away
    var moves = this.controller.check_space(closest_dwarf.x, closest_dwarf.y);
    this.controller.select_space(closest_dwarf.x, closest_dwarf.y)
    var killing_moves = moves.filter(move => {move.kills == 1})
    if (killing_moves.length > 0) {
      this.controller.move(killing_moves[0].x, killing_moves[0].y)
    } else {
      var move_target, space_info, distance = 0;
      moves.forEach((move) => {
        var space_info = this.controller.space_info(move.x, move.y);
        if(space_info.nearest_troll.distance > distance) {
          distance = space_info.nearest_troll.distance;
          move_target = space_info;
        }
      });
      this.controller.move(move_target.x, move_target.y);
    }
  }

  // Get the dwarf who is closest to a troll (or the first with equal distances)
  get_closest_dwarf() {
    var closest_dwarves = [];
    var closest_distance = 999;
    this.controller.dwarves().forEach((dwarf) => {
      var space_info = this.controller.space_info(dwarf.x, dwarf.y);
      if(space_info.nearest_troll.distance < closest_distance) {
        closest_distance = space_info.nearest_troll.distance;
        closest_dwarves = [dwarf];
      }
      if(closest_distance == space_info.nearest_troll.distance) {
        closest_dwarves.push(dwarf);
      }
    });
    return closest_dwarves[0];
  }

  end_turn() {

  }

}
