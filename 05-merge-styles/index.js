const { mkdir, readdir, stat, readFile, writeFile } = require('fs/promises');
const { join, extname } = require('path');

const stylesFolder = './05-merge-styles/styles';
const distFolder = './05-merge-styles/project-dist';
const outputFile = 'bundle.css';

const mergeStyles = async () => {
  try {
    await mkdir(distFolder, { recursive: true });

    const files = await readdir(stylesFolder);

    const cssFiles = files.filter((file) => extname(file) === '.css');

    const stylesArray = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = join(stylesFolder, file);
        const stats = await stat(filePath);

        if (stats.isFile()) {
          const fileContent = await readFile(filePath, 'utf-8');
          return fileContent;
        }
      }),
    );

    const outputPath = join(distFolder, outputFile);
    await writeFile(outputPath, stylesArray.join('\n'));

    console.log('Стили успешно объединены :) ');
  } catch (err) {
    console.error(`Ошибка при объединении стилей: ${err}`);
  }
};

mergeStyles();
