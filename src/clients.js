module.exports = {
  Manual: require('./clients/manual.js'),
  Dummy: require('./clients/dummy.js'),
  DummyTwo: require('./clients/dummy.js'),
  Troll: {
    LastMove: require('./clients/troll/last_move.js')
  }
};

