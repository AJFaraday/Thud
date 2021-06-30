const NodeHtmlParser = require('node-html-parser');
const ClientValidator = require('./../lib/client_validator.js');

class Answer {

  constructor(username, body, side) {
    this.side = side;
    this.username = username.toLowerCase().replace(' ', '_');
    var parsed_answer = NodeHtmlParser.parse(body, {pre: true});
    this.title = parsed_answer.querySelector('h1').text;
    this.code = parsed_answer.querySelector('pre').text;
    this.code = this.code.replace('<code>', '');
    this.code = this.code.replace('</code>', '');
    this.validator = new ClientValidator(this.code, side);
    this.valid = this.validator.valid;
    this.validation_errors = this.validator.errors;
  }


  save() {
    var file_name = this.title.replace(/([A-Z])/g, "_$1").toLowerCase()
  }
}

module.exports = Answer;