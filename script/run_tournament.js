const Tournament = require('./../src/models/tournament.js');
const tournament = new Tournament();
tournament.run();


console.log(tournament.tables());
//tournament.matches.forEach(match => {console.log(match.report())});