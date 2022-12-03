import * as fs from "fs";

let current = 0;
let max = [0, 0, 0];

fs.readFileSync('src/01/input.txt', 'utf8').toString().split('\n')
    .forEach((line: string) => {
        if (line.trim().length === 0) {
            max = [...max, current].sort((a, b) => b - a).slice(0, 3);
            current = 0;
        } else {
            current += Number(line);
        }
    });

console.log(`Part 1: ${max[0]}`);
console.log(`Part 2: ${max.reduce((sum, el) => sum + el, 0)}`);