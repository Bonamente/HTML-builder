const fs = require('fs/promises');
const path = require('path');

const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
};

const getStyleFiles = async (pathForInspect) => {
  const filenames = await fs.readdir(pathForInspect, {withFileTypes: true});
  
  const styleFiles = filenames
    .filter((f) => f.isFile())
    .map((f) => f.name)
    .filter((f) => {
      const [, ext] = f.split('.');
      return ext === 'css';
    });

  return styleFiles; 
};

const mergeStyles = async (src, dest, bundleFileName) => {
  const srcPath = path.resolve(__dirname, src); 
  const destPath = path.resolve(__dirname, dest);
  const bundleFilePath = path.join(destPath, bundleFileName);

  const styleFiles = await getStyleFiles(srcPath);  
  const contents = await Promise.all(styleFiles.map((f) => readFile(path.join(srcPath, f))));

  await fs.writeFile(bundleFilePath, contents.join('\n'));  
};

mergeStyles('styles', 'project-dist', 'bundle.css');
