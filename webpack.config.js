const path = require('path');

module.exports = {
  watch: true,
  mode: 'development',
  entry: {
    thud: './src/index.js',
    tables: './src/results/tables.js',
    matches: './src/results/matches.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'Game'
  }
};