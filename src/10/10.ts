import fs from 'fs';

let output = '';
let x = 1;
let signal = 0;
fs.readFileSync('src/10/input.txt', 'utf8').split(/\s/)
  .forEach((word, position) => {
    const cycle = position + 1;
    const column = cycle % 40;
    output += (column >= x && column <= x + 2) ? '#' : '.';
    if (column === 20) signal += cycle * x;
    if (column === 0) output += '\n';
    const add = Number(word);
    if (!isNaN(add)) {
      x += add;
    }
  });

console.log(`Part 1: ${signal}`);
console.log(`Part 2: \n${output}`);


