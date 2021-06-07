const fs = require('fs');

var string = 'module.exports = {'

function read_file(file) {
  if (file.includes('.')) {
    var parts = file.split('.');
    string += `\n  ${parts[0]}: require('./clients/${file}'),`;
  } else {
    read_directory(file);
  }
}

function read_directory(dir) {
  string += `\n  ${dir}: {`;
  var files = fs.readdirSync(`${__dirname}/../src/clients/${dir}`);
  files.forEach((file) => {
    var parts = file.split('.');
    string += `\n    ${parts[0]}: require('./clients/${dir}/${file}')`;
  });
  string += '\n  },'
}

const files = fs.readdirSync(`${__dirname}/../src/clients`);
files.forEach((file) => {
  read_file(file)
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