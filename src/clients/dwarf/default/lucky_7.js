module.exports = class {
  constructor(controller) {
    this.controller = controller;
    this.side = controller.side;
    this.it_is_a_day = false;
  }

  turn() {
    var dwarf = this.controller.dwarves()[7];
    if(dwarf) {
      var moves = this.controller.check_space(dwarf.x, dwarf.y);
      if(moves[7]) {
        this.controller.select_space(dwarf.x, dwarf.y);
        this.controller.move(moves[7].x, moves[7].y);
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
    var moves = this.controller.check_space(dwarf.x, dwarf.y);
    this.controller.select_space(dwarf.x, dwarf.y);
    this.controller.move(moves[0].x, moves[0].y);
  }

  end_turn() {
    var scores = this.controller.scores();
    this.controller.declare(this.it_is_a_day || scores.winning == 'd');
  }

}
