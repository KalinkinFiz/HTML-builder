const {
  mkdir,
  readdir,
  readFile,
  writeFile,
  copyFile,
} = require('fs/promises');
const { join, extname } = require('path');

const templatePath = './06-build-page/template.html';
const distFolder = './06-build-page/project-dist';
const indexFile = 'index.html';
const styleFile = 'style.css';
const assetsFolder = 'assets';
const stylesFolder = './06-build-page/styles';

const buildPage = async () => {
  try {
    await mkdir(distFolder, { recursive: true });

    const templateContent = await readFile(templatePath, 'utf-8');

    const tags = templateContent.match(/{{[^{}]+}}/g) || [];

    let modifiedTemplate = templateContent;
    for (const tag of tags) {
      const componentName = tag.slice(2, -2).trim();
      const componentPath = join(
        './06-build-page/components',
        `${componentName}.html`,
      );

      try {
        const componentContent = await readFile(componentPath, 'utf-8');
        modifiedTemplate = modifiedTemplate.replace(tag, componentContent);
      } catch (err) {
        if (extname(componentPath) !== '.html') {
          console.error(
            `Игнорирование файла компонента с неверным расширением: ${componentPath}`,
          );
        } else {
          console.error(`Ошибка при чтении файла компонента: ${componentPath}`);
        }
      }
    }

    const indexPath = join(distFolder, indexFile);
    await writeFile(indexPath, modifiedTemplate);

    const stylesArray = await readStyles(stylesFolder);
    const combinedStyles = stylesArray.join('\n');
    const distStylePath = join(distFolder, styleFile);
    await writeFile(distStylePath, combinedStyles);

    const assetsPath = join('./06-build-page', assetsFolder);
    const distAssetsPath = join(distFolder, assetsFolder);
    await copyDirectory(assetsPath, distAssetsPath);

    console.log('Страница успешно построена :)');
  } catch (err) {
    console.error(`Ошибка при построении страницы: ${err}`);
  }
};

const copyDirectory = async (src, dest) => {
  const entries = await readdir(src, { withFileTypes: true });

  await mkdir(dest, { recursive: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
};

const readStyles = async (stylesDir) => {
  const files = await readdir(stylesDir);
  const cssFiles = files.filter((file) => extname(file) === '.css');

  const stylesArray = await Promise.all(
    cssFiles.map(async (file) => {
      const filePath = join(stylesDir, file);
      const fileContent = await readFile(filePath, 'utf-8');
      return fileContent;
    }),
  );

  return stylesArray;
};

buildPage();
