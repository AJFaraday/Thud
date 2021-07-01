const Answer = require('./answer.js');
const Request = require('sync-request');
const FS = require('fs');
const key = require('./key.js');

class AnswerFetcher {
  constructor(site, question_id, side) {
    this.side = side;
    this.url = 'https://api.stackexchange.com/2.2/questions/' + question_id +
      '/answers?site=' + site + '&filter=!.FjsvG2X2tViZPCgDuGvW88wrGptD';
    if (key && key != 'missing') {
      this.url = `${this.url}&key=${key}`
    }
    FS.truncateSync(`${__dirname}/../../data/invalid_${side}.txt`);
  }

  get_answers() {
    var fetcher = this;
    var request = Request('GET', this.url, {json: true, gzip: true})
    var items = JSON.parse(request.getBody('utf8')).items;
    items.forEach(item => {
      var answer = new Answer(
        item.owner.display_name,
        item.body,
        this.side
      );
      if (answer.valid) {
        fetcher.save_answer(answer);
      } else {
        var report = `${answer.username}/${answer.title} is invalid\n${answer.validation_errors.join("\n")}\n\n`
        FS.appendFileSync(`${__dirname}/../../data/invalid_${fetcher.side}.txt`, report);
      }
    });
  }

  save_answer(answer) {
    var filename = answer.title.replace(/([A-Z])/g, "_$1").toLowerCase().replace(' ', '_');
    var folder_path = `${__dirname}/../clients/${this.side}/${answer.username}`
    FS.mkdirSync(folder_path);
    var code = answer.code;
    if (!code.includes('module.exports =')) {
      code = `module.exports = ${code}`;
    }
    console.log(`Saving ${folder_path}/${filename}.js`)
    FS.writeFileSync(`${folder_path}/${filename}.js`, code);
  }

  clear_directory() {
    var folders = FS.readdirSync(`${__dirname}/../../src/clients/${this.side}/`);
    var safe_entries = ['default', 'entry', 'template.js'];
    folders
      .filter((folder) => {
        return !safe_entries.includes(folder)
      })
      .forEach(folder => {
        console.log(`Removing src/clients/${this.side}/${folder}`);
        FS.rmSync(`${__dirname}/..//clients/${this.side}/${folder}`, {recursive: true});
      });
  }
}

module.exports = AnswerFetcher;