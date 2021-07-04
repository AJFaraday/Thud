import Data from './data/matches';
import Utils from './../lib/utils';

class Matches {
  constructor() {
    this.draw();
  }

  draw() {
    var table = Utils.build_element('table', {class: 'league_table'});
    var thead = Utils.build_element('thead');
    ['Dwarf', 'Dwarfs', 'Score', 'Trolls', 'Troll', 'Length'].forEach(header => {
      var th = Utils.build_element('th');
      th.innerHTML = header;
      thead.append(th);
    });
    table.append(thead);
    var tbody = Utils.build_element('tbody');
    Data.forEach(row_data => {
      tbody.append(this.draw_row(row_data));
    });
    table.append(tbody);
    document.getElementById('match_table').append(table);
  }

  draw_row(row_data) {
    var tr = Utils.build_element('tr');
    tr.dataset.dwarf_client = row_data.dwarf_client;
    tr.dataset.troll_client = row_data.troll_client;
    tr.append(this.cell(row_data.dwarf_client.substring(5)));
    tr.append(this.cell(row_data.score.dwarfs));
    tr.append(this.cell(row_data.score.difference));
    tr.append(this.cell(row_data.score.trolls));
    tr.append(this.cell(row_data.troll_client.substring(5)));
    tr.append(this.cell(row_data.length));
    return tr;
  }

  cell(content, attrs = {}) {
    var td = Utils.build_element('td');
    td.innerHTML = content;
    return td;
  }

}

window.matches = new Matches();