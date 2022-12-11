import fs from 'fs';

type Monkey = {
  items: number[]
  operation: string
  throwTo: {
    divisibleBy: number
    isTrue: number,
    isFalse: number
  };
  inspected: number
}

function lastToken(line: string) {
  return Number(line.substring(line.lastIndexOf(' ') + 1));
}

function parseInput() {
  return fs.readFileSync('src/11/input.txt', 'utf8').split('\n\n')
    .map(block => block.split('\n'))
    .filter(lines => lines.length === 6)
    .map(lines => {
      return {
        items: lines[1].split(':')[1].split(',').map(c => Number(c)),
        operation: lines[2].split(':')[1].split('=')[1],
        throwTo: {
          divisibleBy: lastToken(lines[3]),
          isTrue: lastToken(lines[4]),
          isFalse: lastToken(lines[5]),
        },
        inspected: 0,
      };
    });
}

function play(rounds: number, reliefFactor: number) {
  const monkeys = parseInput();
  const productOfDivisibleBy = monkeys.reduce((lcm, m) => lcm * m.throwTo.divisibleBy, 1);
  for (let i = 0; i < rounds; i++) {
    monkeys.forEach(monkey => {
      while (monkey.items.length > 0) {
        const [item] = monkey.items.splice(0, 1);
        const worryLevel = eval(monkey.operation.replaceAll('old', item.toString()));
        const afterRelief = Math.floor(worryLevel / reliefFactor);
        const throwTo = afterRelief % monkey.throwTo.divisibleBy === 0 ? monkey.throwTo.isTrue : monkey.throwTo.isFalse;
        monkeys[throwTo].items.push(afterRelief % productOfDivisibleBy);
        monkey.inspected++;
      }
    });
  }

  const mostActive = monkeys.map(m => m.inspected).sort((a, b) => b - a).splice(0, 2);
  return mostActive[0] * mostActive[1];
}

console.log(`Part 1: ${play(20, 3)}`);
console.log(`Part 2: ${play(10000, 1)}`);


