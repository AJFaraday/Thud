const fs = require('fs');

function getFiles(path) {
  const files = []
  for (const file of fs.readdirSync(path)) {
    if (file != '.gitkeep') {
      const fullPath = path + '/' + file
      if (fs.lstatSync(fullPath).isDirectory()) {
        getFiles(fullPath).forEach(x => files.push(file + '/' + x))
      } else {
        files.push(file)
      }
    }
  }
  return files
}

var string = 'module.exports = {'
var files = getFiles(`${__dirname}/../src/clients/`);
files.forEach((path) => {
  var parts = path.split('./src/clients/');
  var filename = parts[0];
  var name = filename.split('.')[0];
  string += `\n  '${name}': require('./clients/${path}'),`
});
string += "\n};"


fs.writeFile(
  `${__dirname}/../src/clients.js`,
  string,
  (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }
);

