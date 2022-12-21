import fs from 'fs';

const input = fs
  .readFileSync('src/20/input.txt', 'utf-8')
  .split('\n')
  .map((c) => Number(c));

function mod(n: number, modulus: number) {
  return ((n % modulus) + modulus) % modulus;
}

function mix(numbers: number[], turns = 1) {
  const indexes = [...new Array(numbers.length)].map((_, i) => i);
  for (let turn = 0; turn < turns; turn++) {
    numbers.forEach((distance, i) => {
      const oldIndex = indexes[i];
      const newIndex = mod(oldIndex + distance, numbers.length - 1);
      indexes.forEach((index, j) => {
        if (index === oldIndex) {
          indexes[j] = newIndex;
        } else if (newIndex > oldIndex) {
          if (index > oldIndex && index <= newIndex) indexes[j] = mod(index - 1, numbers.length);
        } else {
          if (index < oldIndex && index >= newIndex) indexes[j] = mod(index + 1, numbers.length);
        }
      });
    });
  }
  return indexes;
}

function coordinates(numbers: number[], times = 1) {
  const indexes = mix(numbers, times)
  const indexOfZero = indexes[numbers.findIndex((n) => n === 0)];
  return indexes
    .map((value, index) => [value, index])
    .filter(
      ([value]) =>
        (1000 + indexOfZero) % numbers.length === value ||
        (2000 + indexOfZero) % numbers.length === value ||
        (3000 + indexOfZero) % numbers.length === value,
    )
    .map(([_, index]) => numbers[index])
    .reduce((sum, value) => sum + value, 0);
}

console.log(`Part 1: ${coordinates(input)}`);
console.log(`Part 2: ${coordinates(input.map(n => n * 811589153), 10)}`);
