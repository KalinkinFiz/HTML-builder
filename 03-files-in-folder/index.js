const { readdir, stat } = require('fs');
const { join, parse, extname } = require('path');

const folderPath = './03-files-in-folder/secret-folder';

readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Ошибка чтения директории: ${err}`);
    return;
  }

  files.forEach((file) => {
    const filePath = join(folderPath, file);

    stat(filePath, (statErr, stats) => {
      if (statErr) {
        console.error(
          `Ошибка получения информации по файлу: ${statErr.message}`,
        );
        return;
      }

      if (stats.isFile()) {
        const fileName = parse(file).name;
        const fileExtension = extname(file).slice(1);
        const fileSize = stats.size;

        console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
      }
    });
  });
});
