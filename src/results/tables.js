import Data from './data/tables.js';
import Utils from './../lib/utils';

class Tables {

  constructor() {
    this.draw();
  }

  draw() {
    this.draw_table('dwarf_table', Data.dwarf);
    this.draw_table('troll_table', Data.troll);
    this.draw_table('full_table', Data.overall);
  }

  draw_table(target, data) {
    var table = Utils.build_element('table', {class: 'league_table'});
    var thead = Utils.build_element('thead');
    ['Client', 'Win', 'Lose', 'Score'].forEach(header => {
      var th = Utils.build_element('th');
      th.innerHTML = header;
      thead.append(th);
    });
    table.append(thead);
    var tbody = Utils.build_element('tbody');
    data.forEach(row_data => {
      tbody.append(this.draw_row(row_data));
    });
    table.append(tbody);
    document.getElementById(target).append(table);
  }

  draw_row(data) {
    var kls = data.name.startsWith('dwarf/') ? 'dwarf' : 'troll';
    var tr = Utils.build_element('tr', {class: kls});

    var td = Utils.build_element('td');
    var link = Utils.build_element('a');
    link.href = `./matches.html?client=${data.name}`;
    link.innerHTML = data.name;
    td.append(link);
    tr.append(td);

    ['win', 'lose', 'score'].forEach(attr => {
      var td = Utils.build_element('td');
      td.innerHTML = data[attr];
      tr.append(td);
    });
    return tr;
  }

}

window.tables = new Tables();