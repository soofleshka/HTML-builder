const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inputFilePath = path.join(__dirname, 'user-input.txt');

console.log('Enter text:');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

fs.appendFile(inputFilePath, '', (err) => {
  if (err) throw err;
});

rl.on('line', function (line) {
  if (line.trim() === 'exit') rl.close();
  else
    fs.appendFile(inputFilePath, line + '\n', (err) => {
      if (err) throw err;
    });
});

rl.on('SIGINT', () => {
  if (rl.line)
    fs.appendFile(inputFilePath, rl.line + '\n', (err) => {
      if (err) throw err;
    });
  rl.close();
  console.log();
});

process.on('beforeExit', () => {
  console.log('Good bye!');
});
