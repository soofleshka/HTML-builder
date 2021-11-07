const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

fs.appendFile(__dirname + '/user-input.txt', '', (err) => {
  if (err) throw err;
});

console.log('Enter text:');

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
  console.log('Good bye!');
});
