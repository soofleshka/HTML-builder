const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const pageDirName = 'project-dist';
const pageDirPath = path.join(__dirname, pageDirName);

function errCallback(err) {
  if (err) throw err;
}

const createFolder = async (copyDirPath) => {
  await fsPromises.rm(copyDirPath, {
    recursive: true,
    force: true,
  });
  await fsPromises.mkdir(copyDirPath, {
    recursive: true,
  });
};

const copyDir = async (sourceDirPath, copyDirPath) => {
  await createFolder(copyDirPath);

  const dirents = await fsPromises.readdir(sourceDirPath, {
    withFileTypes: true,
  });
  const directories = dirents.filter((item) => item.isDirectory());
  directories.forEach((directory) => {
    copyDir(
      path.join(sourceDirPath, directory.name),
      path.join(copyDirPath, directory.name)
    );
  });
  const files = dirents.filter((item) => item.isFile());
  files.forEach((file) => {
    fs.copyFile(
      path.join(sourceDirPath, file.name),
      path.join(copyDirPath, file.name),
      errCallback
    );
  });
};

const mergeStyles = async (stylesDirPath, stylesBundleFilePath) => {
  const styleDataArr = [];
  let styleFiles = await fsPromises.readdir(stylesDirPath, {
    withFileTypes: true,
  });
  styleFiles = styleFiles.filter((file) => {
    const filePath = path.join(stylesDirPath, file.name);
    const filePathObject = path.parse(filePath);
    return file.isFile() && filePathObject.ext === '.css';
  });

  for (let styleFile of styleFiles) {
    const styleFilePath = path.join(stylesDirPath, styleFile.name);
    const styleData = await fsPromises.readFile(styleFilePath, 'utf-8');
    styleDataArr.push(styleData);
  }
  bundleStyleFile(stylesBundleFilePath, styleDataArr);
};

async function bundleStyleFile(stylesBundleFilePath, styleDataArr) {
  await fsPromises.rm(stylesBundleFilePath, { force: true });
  for (let styleData of styleDataArr) {
    fs.appendFile(stylesBundleFilePath, styleData + '\n', 'utf-8', errCallback);
  }
}

const copyAssets = () => {
  const sourceAssetsPath = path.join(__dirname, 'assets');
  const pageAssetsPath = path.join(pageDirPath, 'assets');
  copyDir(sourceAssetsPath, pageAssetsPath);
};

const createStyleCSS = () => {
  const sourceStylesPath = path.join(__dirname, 'styles');
  const pageStylePath = path.join(pageDirPath, 'style.css');
  mergeStyles(sourceStylesPath, pageStylePath);
};

const createIndexHTML = async () => {
  const templatePath = path.join(__dirname, 'template.html');
  const htmlComponentsDirPath = path.join(__dirname, 'components');
  const htmlPath = path.join(pageDirPath, 'index.html');
  let htmlString = await fsPromises.readFile(templatePath, 'utf-8');

  const templateTags = htmlString.match(/{{\w+}}/g);
  for (const tag of templateTags) {
    const componentName = tag.replace(/\W/g, '') + '.html';
    const componentHtmlPath = path.join(htmlComponentsDirPath, componentName);
    const componentHtml = await fsPromises.readFile(componentHtmlPath, 'utf-8');
    htmlString = htmlString.replace(tag, componentHtml);
  }

  fs.appendFile(htmlPath, htmlString, 'utf-8', errCallback);
};

const buildPage = async () => {
  await createFolder(pageDirPath);
  copyAssets();
  createStyleCSS();
  createIndexHTML();
};

buildPage().catch((e) => console.log(e));
