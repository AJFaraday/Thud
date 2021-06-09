const Clients = require('./../clients.js');
const Utils = require('./utils.js');

class Modal {
  constructor(game) {
    this.game = game;
    this.background = document.getElementById('modal_background');
    this.modal_div = document.getElementById('modal');

  }

  show_form() {
    this.build_form();
    this.background.style.width = `${window.innerWidth}px`;
    this.background.style.height = `${window.innerHeight}px`;
    this.background.style.display = 'block';

    this.modal_div.style.width = '300px';
    this.modal_div.style.left = `${((window.innerWidth - 300) / 2) - 20}px`;

    this.modal_div.style.display = 'block';
  }

  hide_form() {
    this.background.style.display = 'none';
    this.modal_div.style.display = 'none';
  }

  build_form() {
    this.modal_div.innerHTML = '';

    var title = Utils.build_element('h2');
    title.innerHTML = 'Customise Game';
    this.modal_div.append(title);
    this.form = Utils.build_element('form');
    Utils.addListener(this.form, 'submit', (e) => {this.submit_form(e, this)});
    this.build_client_select('Dwarf', this.game.dwarf_client_name, ['inert', 'dwarf']);
    this.build_client_select('Troll', this.game.troll_client_name, ['inert', 'troll']);
    this.build_speed_select();
    this.build_submit();
    this.build_close_link();
    this.modal_div.append(this.form);
  }

  build_client_select(label_text, current_client_name, groups) {
    var label = Utils.build_element('label', {for: 'label'});
    label.innerHTML = label_text;
    this.form.append(label);
    var select = Utils.build_element('select', {name: label_text});
    var optgroups = {};
    Object.keys(Clients).forEach((client_name) => {
      this.build_client_option(select, optgroups, client_name, current_client_name, groups);
    });
    Object.values(optgroups).forEach((optgroup) => {
      select.append(optgroup);
    });
    this.form.append(select);
    this.form.append(Utils.build_element('br', {clear: 'both'}));
    this.form.append(Utils.build_element('br', {clear: 'both'}));
  }

  build_client_option(select, optgroups, client_name, current_client_name, groups) {
    var parts = client_name.split('/');
    if(!groups.includes(parts[0])) {
      return;
    }
    var optgroup = optgroups[parts[0]];
    if(!optgroup) {
      optgroup = Utils.build_element('optgroup', {label: parts[0]});
      optgroups[parts[0]] = optgroup;
    }
    var option = Utils.build_element('option', {value: client_name});
    if (client_name == current_client_name) {
      option.setAttribute('selected', 'true');
    }
    option.innerHTML = parts[1];
    optgroup.append(option);
  }

  build_speed_select() {
    var label = Utils.build_element('label', {for: 'label'});
    label.innerHTML = 'Turn Time (ms)';
    this.form.append(label);
    var select = Utils.build_element('select', {name: 'speed'});
    [0, 100, 200, 500, 1000].forEach((opt) => {
      var option = Utils.build_element('option', {value: opt});
      if (opt == 200) {
        option.setAttribute('selected', 'true');
      }
      option.innerHTML = opt;
      select.append(option);
    });
    this.form.append(select);
    this.form.append(Utils.build_element('br', {clear: 'both'}));
    this.form.append(Utils.build_element('br', {clear: 'both'}));
  }

  build_submit() {
    this.submit_button = Utils.build_element('input', {type: 'submit', value: 'Run Game'})
    this.form.append(this.submit_button);
  }

  build_close_link() {
    var modal = this;
    this.close_link = Utils.build_element('a', {href: '#'}, {float: 'right'});
    this.close_link.innerHTML = 'Close';
    this.close_link.addEventListener('mouseup', (e) => {
      e.preventDefault();
      modal.hide_form();
    });
    this.form.append(this.close_link);
  }

  submit_form(e, modal) {
    e.preventDefault();
    var form_data = new FormData(modal.form);
    game.reinit(
      form_data.get('Dwarf'),
      form_data.get('Troll'),
      form_data.get('speed')
    )
    modal.hide_form();
  }
}

module.exports = Modal;