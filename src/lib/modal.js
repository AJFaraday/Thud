const Clients = require('./../clients.js');
const Utils = require('./utils.js');
const ClientValidator = require('./client_validator.js');

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
    this.modal_div.style.height = '200px';
    this.modal_div.style.top = `110px`;
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
    Utils.addListener(this.form, 'submit', (e) => {
      this.submit_form(e, this)
    });
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

    var edit_link = Utils.build_element('a', {href: '#'}, {float: 'right'});
    edit_link.innerHTML = 'Edit';
    edit_link.addEventListener('mouseup', this.open_edit_form)
    this.form.append(edit_link);

    this.form.append(Utils.build_element('br', {clear: 'both'}));
    this.form.append(Utils.build_element('br', {clear: 'both'}));
  }

  build_client_option(select, optgroups, client_path, current_client_name, groups) {
    var parts = client_path.split('/');
    var group_name = parts[0]
    var user_name = parts[parts.length - 2];
    var client_name = parts[parts.length - 1];
    if (!groups.includes(group_name)) {
      return;
    }
    var optgroup = optgroups[user_name];
    if (!optgroup) {
      optgroup = Utils.build_element('optgroup', {label: user_name});
      optgroups[user_name] = optgroup;
    }
    var option = Utils.build_element('option', {value: client_path});
    if (client_path == current_client_name) {
      option.setAttribute('selected', 'true');
    }
    option.innerHTML = client_name;
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

  open_edit_form(e) {
    e.preventDefault();
    var client_name = e.currentTarget.previousElementSibling.value;

    modal.background.style.width = `${window.innerWidth}px`;
    modal.background.style.height = `${window.innerHeight}px`;
    modal.background.style.display = 'block';

    modal.modal_div.style.width = '700px';
    modal.modal_div.style.top = '50px';
    modal.modal_div.style.height = `${window.innerHeight - 150}px`;
    modal.modal_div.style.left = `${((window.innerWidth - 700) / 2) - 20}px`;

    modal.modal_div.style.display = 'block';
    modal.build_edit_form(client_name);
  }

  build_edit_form(client_name) {
    this.modal_div.innerHTML = '';
    var title = Utils.build_element('h2');
    title.innerHTML = `Edit ${client_name}`;
    this.modal_div.append(title);

    var hidden_field = Utils.build_element(
      'input',
      {name: 'client_name', value: client_name},
      {display: 'none'}
    );
    this.modal_div.append(hidden_field);

    var area = Utils.build_element(
      'textarea',
      {name: 'client_body'},
      {
        width: `${this.modal_div.offsetWidth - 45}px`,
        height: `${this.modal_div.offsetHeight - 150}px`
      }
    );
    area.value = Clients[client_name].toString();
    area.addEventListener('keyup', () => {this.validate_client()});
    this.modal_div.append(area);

    var save_button = Utils.build_element('div', {class: 'button'}, {float: 'left'});
    save_button.innerHTML = 'Save';
    save_button.addEventListener('mouseup', this.save_edit_form);
    this.modal_div.append(save_button);

    var close_button = Utils.build_element('div', {class: 'button'}, {float: 'right'});
    close_button.innerHTML = 'Close';
    close_button.addEventListener('mouseup', () => {
      this.show_form();
    });
    this.modal_div.append(close_button);

    this.validate_button = Utils.build_element('div', {class: 'button'}, {float: 'right'});
    this.validate_button.innerHTML = 'Validate';
    this.validate_button.addEventListener('mouseup', () => {
      this.validate_client();
    });

    this.modal_div.append(this.validate_button);

    var copy_button = Utils.build_element('div', {class: 'button'}, {float: 'right'});
    copy_button.innerHTML = 'Copy';
    copy_button.addEventListener('mouseup', this.copy_edit_form);
    this.modal_div.append(copy_button);
  }

  validate_client() {
    var client_name = document.getElementsByName('client_name')[0].value;
    var client_body_field = document.getElementsByName('client_body')[0]
    var client_body = client_body_field.value;
    var validator = new ClientValidator(client_body, client_name);
    console.clear();
    if (validator.valid) {
      this.validate_button.classList.remove('red');
      this.validate_button.classList.add('green');
      console.log("%c Client valid!", 'color: #009900')
    } else {
      this.validate_button.classList.remove('green');
      this.validate_button.classList.add('red');

      console.log("%c Client invalid:", 'color: #FF0000')
      validator.errors.forEach((error) => {
        console.log(`%c ${error}`, 'color: #FF0000')
      });
    }
    if (validator.messages.length > 0) {
      console.log("Messages:")
      validator.messages.forEach((message) => {
        console.log(message);
      });
    }

  }

  copy_edit_form() {
    var client_body_field = document.getElementsByName('client_body')[0]
    var client_body = client_body_field.value;
    var full_client_body = `module.exports = ${client_body_field.value}`;

    client_body_field.value = full_client_body;
    client_body_field.select();
    client_body_field.setSelectionRange(0, 9999999);
    document.execCommand('copy');
    client_body_field.value = client_body;
  }

  save_edit_form() {
    var client_name = document.getElementsByName('client_name')[0].value;
    var client_body = document.getElementsByName('client_body')[0].value;
    try {
      var kls = eval(`window.kls = ${client_body}`);
      Clients[client_name] = kls;
      modal.show_form();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Modal;