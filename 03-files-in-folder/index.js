const fs = require('fs/promises');
const path = require('path');

const showFiles = async (pathForInspect) => {
  const absolutePath = path.resolve(__dirname, pathForInspect);
  const filenames = await fs.readdir(absolutePath, {withFileTypes: true});
  const files = filenames
    .filter((f) => f.isFile())
    .map((f) => f.name);  
 
  const filepaths = files.map((f) => path.join(absolutePath, f));
  const stats = await Promise.all(filepaths.map(fs.stat));
  const sizes = stats.map((s) => `${s.size / 1000}kb`);
  
  const output = files.map((file, idx) => {
    const [name, ext] = file.split('.');

    return `${name} - ${ext} - ${sizes[idx]}`;
  }).join('\n');

  console.log(`\n${output}\n`);
};

showFiles('secret-folder');
