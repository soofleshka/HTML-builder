const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  rl.output.write(chalk.black.bgRedBright(stringToWrite));
};

fs.appendFile(__dirname + '/user-input.txt', '', (err) => {
  if (err) throw err;
});

console.log(chalk.bgWhiteBright.bold('Enter text:'));

rl.on('line', function (line) {
  if (line === 'exit') rl.close();
  else
    fs.appendFile(__dirname + '/user-input.txt', line + '\n', (err) => {
      if (err) throw err;
    });
});

rl.on('SIGINT', () => {
  if (rl.line)
    fs.appendFile(__dirname + '/user-input.txt', rl.line + '\n', (err) => {
      if (err) throw err;
    });
  rl.close();
  console.log();
});

process.on('beforeExit', () => {
  console.log(chalk.bgWhiteBright.bold('Good bye!'));
});
