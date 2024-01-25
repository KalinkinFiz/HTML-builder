const { mkdir, readdir, readFile, writeFile, unlink } = require('fs/promises');
const { join } = require('path');

const sourceFolder = join(__dirname, './files');
const destinationFolder = join(__dirname, './files-copy');

const copyFiles = async () => {
  try {
    await mkdir(destinationFolder, { recursive: true });

    const sourceFiles = await readdir(sourceFolder);

    const destinationFiles = await readdir(destinationFolder);

    for (const file of destinationFiles) {
      if (!sourceFiles.includes(file)) {
        const filePathToRemove = join(destinationFolder, file);
        await unlink(filePathToRemove);
      }
    }

    for (const file of sourceFiles) {
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
