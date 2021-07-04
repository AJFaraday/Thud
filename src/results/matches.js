import Data from './data/matches';
import Utils from './../lib/utils';

class Matches {
  constructor() {
    this.draw();
    this.build_select();
    this.url_client = new URLSearchParams(window.location.search).get('client');
    if (this.url_client) {
      this.select.value = this.url_client;
      this.client_filter(this.url_client);
    }
  }

  client_filter(client) {
    var rows = document.querySelectorAll("tbody > tr");
    if (client == 'All') {
      visible_rows = [].slice.call(rows);
    } else {
      var visible_rows = [].slice.call(rows).filter(row => {
        return row.dataset.troll_client == client || row.dataset.dwarf_client == client
      });
    }
    [].slice.call(rows).forEach(row => row.style.visibility = 'collapse');
    visible_rows.forEach(row => {
      row.style.visibility = 'visible';
      row.nextSibling.style.visibility = 'visible';
    });
  }

  build_select() {
    this.select = Utils.build_element('select', {class: 'client_select'});
    this.all_clients().forEach(client_name => {
      var option = Utils.build_element('option', {value: client_name});
      option.innerHTML = client_name;
      this.select.append(option);
    });
    var div = Utils.build_element('div', {}, {margin: 'auto', width: '300px'});
    div.append(this.select);
    document.getElementById('button_holder').prepend(div);
    this.select.addEventListener('change', () => {
      this.client_filter(this.select.value);
    });
  }

  all_clients() {
    if (this.unique_client_list) {
      return this.unique_client_list;
    } else {
      var clients_with_dups = [];
      Data.forEach(match => {
        clients_with_dups.push(match.troll_client);
        clients_with_dups.push(match.dwarf_client);
      });
      this.unique_client_list = ['All'];
      clients_with_dups.forEach(client => {
        if (this.unique_client_list.indexOf(client) == -1) {
          this.unique_client_list.push(client);
        }
      });
      this.unique_client_list = this.unique_client_list.sort();
      return this.unique_client_list;
    }
  }


  draw() {
    var table = Utils.build_element('table', {class: 'matches_table'});
    document.getElementById('match_table').append(table);
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
      tbody.append(this.visualisation_row(row_data, table));
    });
    table.append(tbody);
  }

  visualisation_row(data, table) {
    var tr = Utils.build_element('tr');
    var td = Utils.build_element('td', {colspan: 6});
    var dwarf_width = (table.clientWidth / 64) * Math.abs(data.sort_score - 32);
    var dwarf_vis = Utils.build_element('div', {class: 'vis'}, {
      'background-color': 'blue',
      width: `${dwarf_width}px`
    });
    td.append(dwarf_vis);
    var troll_width = table.clientWidth - dwarf_width;
    var troll_vis = Utils.build_element('div', {class: 'vis'}, {
      'background-color': 'green',
      width: `${troll_width - 10}px`
    });
    td.append(troll_vis);
    tr.append(td);
    return tr;
  }

  draw_row(row_data) {
    var tr = Utils.build_element('tr');
    tr.dataset.dwarf_client = row_data.dwarf_client;
    tr.dataset.troll_client = row_data.troll_client;
    tr.addEventListener('click', (e) => {
      var row = e.target.parentElement;
      var dwarf_client = row.dataset.dwarf_client;
      var troll_client = row.dataset.troll_client;
      window.location = `./index.html?dwarf_client=${dwarf_client}&troll_client=${troll_client}`;
    });
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