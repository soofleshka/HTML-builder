const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const stylesDirName = 'styles';
const stylesDirPath = path.join(__dirname, stylesDirName);
const stylesBundleFileName = 'bundle.css';
const stylesBundleFilePath = path.join(
  __dirname,
  'project-dist',
  stylesBundleFileName
);

function errCallback(err) {
  if (err) throw err;
}

const mergeStyles = async () => {
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
  bundleStyleFile(styleDataArr);
};

async function bundleStyleFile(styleDataArr) {
  await fsPromises.unlink(stylesBundleFilePath);
  for (let styleData of styleDataArr) {
    fs.appendFile(stylesBundleFilePath, styleData, 'utf-8', errCallback);
  }
}

mergeStyles().catch((e) => console.log(e));
