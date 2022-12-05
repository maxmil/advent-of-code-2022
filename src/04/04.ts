import fs from "fs";

const count = (a: boolean[]) => a.filter(it => it).length;

const elves = fs.readFileSync('src/04/input.txt', 'utf8').toString().split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.split(",").map(range => range.split('-').map(c => Number(c))));

const contained = elves.map(([elf1, elf2]) =>
    (elf1[0] <= elf2[0] && elf1[1] >= elf2[1]) || (elf2[0] <= elf1[0] && elf2[1] >= elf1[1]));

console.log(`Part 1: ${count(contained)}`);

const overlapped = elves.map(([elf1, elf2]) =>
    (elf1[0] <= elf2[1] && elf1[1] >= elf2[0]) || (elf2[0] <= elf1[1] && elf2[1] >= elf1[0]));

console.log(`Part 2: ${count(overlapped)}`);