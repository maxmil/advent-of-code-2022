import fs from "fs";

const input = fs.readFileSync('input.txt', 'utf8').split('');

function findMarker(n) {
    for (let i = n; i < input.length; i++) {
        if (new Set(input.slice(i - n, i)).size === n) return i;
    }
}

console.log(`Part 1: ${findMarker(4)}`);
console.log(`Part 2: ${findMarker(14)}`);