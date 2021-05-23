const path = require('path');

module.exports = {
  watch: true,
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'thud.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'Game'
  }
};