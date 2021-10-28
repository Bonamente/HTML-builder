const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
let fileData = '';

const stream = fs.createReadStream(filePath, 'utf-8');

stream.on('data', (partData) => fileData += partData);
stream.on('end', () => console.log(fileData));
stream.on('error', (error) => console.log('Error', error.message));
