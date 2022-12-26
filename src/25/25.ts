import fs from 'fs';

const snafuChars = ['=', '-', '0', '1', '2'];

function toDecimal(snafu: string[]) {
  return snafu.reduce((sum, c, index) => sum + Math.pow(5, snafu.length - 1 - index) * (snafuChars.indexOf(c) - 2), 0);
}

function toSnafu(n: number) {
  let pos = 0;
  let remaining = n;
  let snafu = '';
  while (remaining > 0) {
    const remainder = remaining % Math.pow(5, pos + 1);
    const value = remainder / Math.pow(5, pos);
    if (value < 3) {
      snafu = String(value) + snafu;
      remaining -= remainder;
    } else {
      snafu = snafuChars[value - 3] + snafu;
      remaining += Math.pow(5, pos + 1) - remainder;
    }
    pos++;
  }
  return snafu;
}

const input = fs.readFileSync('src/25/input.txt', 'utf-8').split('\n');

const sum = input.map((snafu) => toDecimal(snafu.split(''))).reduce((sum, n) => n + sum, 0);
console.log(`Part 1: ${toSnafu(sum)}`)
