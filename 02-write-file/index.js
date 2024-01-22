const { join } = require('path');
const { createWriteStream } = require('fs');
const { createInterface } = require('readline');
const { stdin, stdout } = require('process');

const filePath = join(__dirname, 'text.txt');

const writeStream = createWriteStream(filePath);

console.log('Введите текст ниже или введите "exit" для завершения:');

const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: '> ',
});

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye! Процесс завершен.');
    writeStream.end();
    rl.close();
  } else {
    writeStream.write(input + '\n');
    rl.prompt();
  }
});

rl.on('SIGINT', () => {
  console.log('\nGoodbye! Процесс завершен.');
  writeStream.end();
  rl.close();
  process.exit();
});

rl.prompt();
