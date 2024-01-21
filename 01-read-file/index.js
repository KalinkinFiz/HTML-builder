const { createReadStream } = require('fs');
const { join } = require('path');
const { stdout } = require('process');

const filePath = join(__dirname, 'text.txt');

const readStream = createReadStream(filePath);

readStream.pipe(stdout);

readStream.on('error', (err) => {
  console.error(`Ошибка в чтении файла: ${err}`);
});
