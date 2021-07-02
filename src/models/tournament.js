const Game = require('./game.js');
const Match = require('./match.js');
const Clients = require('../clients.js');
const FS = require('fs');

class Tournament {

  constructor() {
    this.league = {dwarf: [], troll: []}
    this.dwarf_clients = this.get_clients('dwarf');
    this.troll_clients = this.get_clients('troll');
    this.get_matches();
  }

  get_clients(side) {
    var clients = []
    Object.keys(Clients).forEach(name => {
      if (name.includes(side) && !(name.includes('inert') || name.includes('template'))) {
        clients.push(name);
        this.league[side][name] = {name: name, win: 0, lose: 0, score: 0};
      }
    });
    return clients;
  }

  get_matches() {
    this.matches = [];
    this.dwarf_clients.forEach(dwarf_client => {
      this.troll_clients.forEach(troll_client => {
        this.matches.push(new Match(dwarf_client, troll_client));
      });
    });
  }

  run() {
    this.matches.forEach(match => {
      try {
        match.run();
      } catch (er) {
        console.log(`Could not complete ${match.dwarf_client} vs. ${match.troll_client}`);
        console.log(er);
        console.log('');
      }
      if (match.score.winning == 't') {
        var winner = this.league.troll[match.troll_client];
        winner.win += 1;
        winner.score += match.score.difference;
        var loser = this.league.dwarf[match.dwarf_client];
        loser.lose += 1;
        loser.score -= match.score.difference;
      } else if (match.score.winning == 'd') {
        var winner = this.league.dwarf[match.dwarf_client];
        winner.win += 1;
        winner.score += match.score.difference;
        var loser = this.league.troll[match.troll_client];
        loser.lose += 1;
        loser.score -= match.score.difference;
      }
    });
    this.save_data();
  }

  save_data() {
    FS.writeFileSync(
      `${__dirname}/../../dist/data/tables.json`,
      JSON.stringify(this.tables())
    );
    FS.writeFileSync(
      `${__dirname}/../../dist/data/matches.json`,
      JSON.stringify(this.matches.map(match => match.report()))
    );
  }

  tables() {
    return {
      dwarf: this.build_table('dwarf'),
      troll: this.build_table('troll'),
      overall: this.build_overall_table()
    };
  }

  build_table(side) {
    return Object.values(this.league[side]).sort((a, b) => {return b.score - a.score});
  }

  build_overall_table() {
    return Object.values(this.league.troll)
      .concat(Object.values(this.league.dwarf))
      .sort((a, b) => {return b.score - a.score});
  }

}

module.exports = Tournament;