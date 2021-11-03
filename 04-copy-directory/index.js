const fs = require('fs/promises');
const path = require('path');

const filesPath = path.resolve(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

const copyDir = async (src, dest) => {
  await fs.rm(dest, { recursive: true, force: true });
  await fs.mkdir(dest, { recursive: true });
  
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory() ?
      await copyDir(srcPath, destPath) :
      await fs.copyFile(srcPath, destPath);
  }
};

copyDir(filesPath, filesCopyPath);
