const AnswerFetcher = require('./../src/import/answer_fetcher.js')

var troll_fetcher = new AnswerFetcher('codegolf', 230966, 'troll');
troll_fetcher.clear_directory();
troll_fetcher.get_answers();
var dwarf_fetcher = new AnswerFetcher('codegolf', 230965, 'dwarf');
dwarf_fetcher.clear_directory();
dwarf_fetcher.get_answers();

