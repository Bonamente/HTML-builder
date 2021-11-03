const fs = require('fs/promises');
const path = require('path');

const templatePath = path.resolve(__dirname, 'template.html');
const assetsPath = path.resolve(__dirname, 'assets');
const stylesDirPath = path.resolve(__dirname, 'styles');

const distPath = path.join(__dirname, 'project-dist');
const htmlPath = path.join(distPath, 'index.html');
const assetsCopyPath = path.join(distPath, 'assets');

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
  const bundleFilePath = path.join(dest, bundleFileName);
  const styleFiles = await getStyleFiles(src);  
  const contents = await Promise.all(styleFiles.map((f) => readFile(path.join(src, f))));

  await fs.writeFile(bundleFilePath, contents.join('\n'));  
};

const copyDir = async (src, dest) => {
  await fs.rm(dest, { recursive: true, force: true });  
  await fs.mkdir(dest, { recursive: true });
  
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const distPath = path.join(dest, entry.name);

    entry.isDirectory() ?
      await copyDir(srcPath, distPath) :
      await fs.copyFile(srcPath, distPath);
  }
};

const replaceTagsWithComponents = async (htmlFile) => {
  const htmlFileContent = await readFile(htmlFile);
  const templateTagReg = /{{(.*?)}}/g;
  const templateTags = htmlFileContent.match(templateTagReg);

  for (const tag of templateTags) {
    const tagName = tag.slice(tag.indexOf('{', 1) + 1, tag.lastIndexOf('}', tag.length - 2));
    const componentPath = path.resolve(__dirname, 'components', `${tagName}.html`);  
    const componentContent = await readFile(componentPath);
    
    const currentHtmlFileContent = await readFile(htmlFile);    
    const newHtmlFileContent = currentHtmlFileContent.replace(tag, componentContent);

    await fs.writeFile(htmlFile, newHtmlFileContent);
  }
};

const buildPage = async () => {
  await fs.rm(distPath, { recursive: true, force: true });  
  await fs.mkdir(distPath, { recursive: true });

  const templateContent = await readFile(templatePath);
  await fs.writeFile(htmlPath, templateContent);
  
  await replaceTagsWithComponents(htmlPath);
  await copyDir(assetsPath, assetsCopyPath);
  await mergeStyles(stylesDirPath, distPath, 'style.css');  
};

buildPage();