const { mkdir, readdir, readFile, writeFile } = require('fs/promises');
const { join } = require('path');

const sourceFolder = join(__dirname, './files');
const destinationFolder = join(__dirname, './files-copy');

const copyFiles = async () => {
  try {
    await mkdir(destinationFolder, { recursive: true });

    const files = await readdir(sourceFolder);

    for (const file of files) {
      const sourceFilePath = join(sourceFolder, file);
      const destinationFilePath = join(destinationFolder, file);

      const fileContent = await readFile(sourceFilePath);

      await writeFile(destinationFilePath, fileContent);
    }

    console.log('Файлы скопированы');
  } catch (err) {
    console.error(`Ошибка при копировании: ${err}`);
  }
};

copyFiles();
