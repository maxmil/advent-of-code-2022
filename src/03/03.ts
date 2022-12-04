import fs from "fs";

const itemPriority = (item: string) => (item.toLowerCase() === item) ? item.charCodeAt(0) - 96 : item.charCodeAt(0) - 38;
const sum = (a: number[]) => a.reduce((sum, el) => sum + el, 0);

const lines = fs.readFileSync('src/03/input.txt', 'utf8').toString().split('\n')
    .filter(line => line.trim().length > 0);

const priorities = lines.map(line => {
    const compartmentSize = line.length / 2;
    const first = line.substring(0, compartmentSize);
    const second = line.substring(compartmentSize);
    const shared = [...new Set(first.split('').filter(item => second.includes(item)))];
    return sum(shared.map(c => itemPriority(c)));
});

console.log(`Part 1: ${sum(priorities)}`);

const groupElves = (a: string[]): string[][] => a.length ? [a.splice(0, 3), ...groupElves(a)] : [];

const badgePriorities = groupElves(lines).map(group => {
    const badge = group[0].split('').filter(item => group[1].includes(item) && group[2].includes(item))[0];
    return itemPriority(badge);
})

console.log(`Part 2: ${sum(badgePriorities)}`);




