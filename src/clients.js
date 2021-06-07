module.exports = {
  Manual: require('./clients/manual.js'),
  Dummy: require('./clients/dummy.js'),
  DummyTwo: require('./clients/dummy.js'),
  Troll: {
    LastMove: require('./clients/troll/last_move.js')
  },
  Dwarf: {
    Lucky_7: require('./clients/dwarf/lucky_7')
  }
};
