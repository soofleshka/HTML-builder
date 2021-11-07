const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const sourceDirName = 'files';
const sourceDirPath = path.join(__dirname, sourceDirName);
const copyDirName = 'files-copy';
const copyDirPath = path.join(__dirname, copyDirName);

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

copyDir(sourceDirPath, copyDirPath).catch((e) => console.log(e));

module.exports = { copyDir, createFolder };
