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

const copyDir = async () => {
  await fsPromises.rm(copyDirPath, {
    recursive: true,
    force: true,
  });
  await fsPromises.mkdir(copyDirPath, {
    recursive: true,
  });
  let files = await fsPromises.readdir(sourceDirPath, { withFileTypes: true });
  files = files.filter((item) => item.isFile());
  files.forEach((file) => {
    fs.copyFile(
      path.join(sourceDirPath, file.name),
      path.join(copyDirPath, file.name),
      errCallback
    );
  });
};

copyDir().catch((e) => console.log(e));
