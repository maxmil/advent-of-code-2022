import fs from 'fs';

type List = List[] | number[]

function isNumber(n: number | List): n is number {
    return typeof n === 'number';
}

function asList(numberOrList: number | List): List {
    return isNumber(numberOrList) ? [numberOrList] : numberOrList
}

function compareTo(first: List, second: List): number {
    if (first.length === 1 && isNumber(first[0]) && second.length === 1 && isNumber(second[0])) {
        return first[0] - second[0];
    }
    for (let i = 0; i < first.length; i++) {
        if (second.length < i + 1) return 1;
        const compareResult = compareTo(asList(first[i]), asList(second[i]));
        if (compareResult !== 0) return compareResult;
    }
    return first.length - second.length;
}

const pairs = fs.readFileSync('src/13/input.txt', 'utf8')
    .split('\n\n')
    .filter(line => line.trim().length > 0)
    .map(lines => lines.split('\n'))
    .map(([line1, line2]) => [eval(line1), eval(line2)])

const sortedPairs = pairs
    .map(([first, second]) => compareTo(first, second))
    .reduce((sum, compareTo, index) => compareTo <= 0 ? sum + (index + 1) : sum, 0);
console.log(`Part 1: ${sortedPairs}`);

const decoderPackets = [[[2]], [[6]]];
const sorted = pairs
    .flatMap((pair) => pair)
    .concat(decoderPackets)
    .sort(compareTo);
const decoderKey = sorted.reduce((acc, value, index) => value === decoderPackets[0] || value === decoderPackets[1] ? acc * (index + 1) : acc, 1);
console.log(`Part 2: ${decoderKey}`);


