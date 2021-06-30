module.exports = class {
  constructor(controller, utils) {
    this.controller = controller;
    this.side = controller.side;
    this.utils = utils;
    this.it_is_a_day = false;
  }

  turn() {
    var dwarf = this.controller.dwarves()[7];
    if(dwarf) {
      var moves = this.controller.check_space(dwarf.x, dwarf.y).safe_moves;
      if(moves[0]) {
        this.controller.select_space(dwarf.x, dwarf.y);
        this.controller.move(moves[0].x, moves[0].y);
      } else {
        this.call_it_a_day();
      }
    } else {
      this.call_it_a_day();
    }
  }

  call_it_a_day() {
    this.it_is_a_day = true;
    this.controller.declare(true);

    var dwarf = this.controller.dwarves()[0];
    var space_info = this.controller.check_space(dwarf.x, dwarf.y);
    this.controller.select_space(dwarf.x, dwarf.y);
    this.controller.move(space_info.moves[0].x, space_info.moves[0].y);
  }

  end_turn() {
    var scores = this.controller.scores();
    this.controller.declare(this.it_is_a_day || scores.winning == 'd');
  }

}
