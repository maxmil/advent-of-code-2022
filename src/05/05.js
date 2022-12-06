import fs from "fs";

const [start, rearrangement] = fs.readFileSync('input.txt', 'utf8').toString().split('\n\n')

const startRows = start.split('\n');
const nStacks = startRows[startRows.length - 2].split(' ').length;
const commands = rearrangement.split('\n').map(line => line.split(/\D+/).slice(1).map((it, index) => index ? Number(it) - 1 : Number(it)));

function initStacks() {
    const stacks = [...new Array(nStacks)].map(() => []);
    for (let i = startRows.length - 2; i >= 0; i--) {
        for (let j = 0; j < nStacks; j++) {
            const item = startRows[i].charAt(4 * j + 1).trim();
            if (item.length > 0) {
                stacks[j].push(item);
            }
        }
    }
    return stacks;
}

function part1() {
    const stacks = initStacks();
    commands.forEach(([move, from, to]) => {
        for (let i = 0; i < move; i++) stacks[to].push(stacks[from].pop());
    });
    console.log(`Part 1: ${stacks.map(s => s[s.length - 1]).join('')}`)
}

function part2() {
    const stacks = initStacks();
    commands.forEach(([move, from, to]) => stacks[to].push(...(stacks[from].splice(-move))));
    console.log(`Part 2: ${stacks.map(s => s[s.length - 1]).join('')}`)
}

part1();
part2();

