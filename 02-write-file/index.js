const fs = require('fs');
const path = require('path');

const stdin = process.stdin;
const stdout = process.stdout;

const filePath = path.join(__dirname, 'text.txt');

let output;

stdout.write('Введите, пожалуйста, текст:\n');
stdin.on('data', (data) => {
  if (!output) {
    output = fs.createWriteStream(filePath);
  }

  const text = data.toString();

  if (text.trim() === 'exit') {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    stdout.write('\nСпасибо и хорошего дня!\n');    
    process.exit();
  }

  output.write(text);
});

process.on('SIGINT', () => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }   
  });
  stdout.write('\nСпасибо и хорошего дня!\n');
  process.exit();
});