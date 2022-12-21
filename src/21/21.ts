import fs from 'fs';

const input: [string, string][] = fs
  .readFileSync('src/21/input.txt', 'utf-8')
  .split('\n')
  .map((line) => {
    const parts = line.split(': ');
    return [parts[0], parts[1]];
  });

const monkeys = new Map(input);

type Operator = '+' | '*' | '-' | '/';
type Operation = [Result, Result, Operator];
type Result = 'humn' | number | Operation;

const operators: Operator[] = ['+', '*', '-', '/'];

function inverse(operator: Operator) {
  return operators[(operators.indexOf(operator) + 2) % 4];
}

function getResult(monkey: string, ignoreHmn = true): Result {
  if (!ignoreHmn && monkey.startsWith('humn')) return 'humn';
  const operation = monkeys.get(monkey)!;
  if (!operation.includes(' ')) return Number(operation);
  const [monkey1, operator, monkey2] = operation.split(' ');
  const result: Result = [getResult(monkey1, ignoreHmn), getResult(monkey2, ignoreHmn), operator as Operator];
  if (isNumber(result[0]) && isNumber(result[1])) return eval(result[0] + operator + result[1]);
  return result;
}

function isHumn(result: Result): result is 'humn' {
  return result === 'humn';
}

function isNumber(result: Result): result is number {
  return typeof(result) === "number";
}

console.log(`Part 1: ${getResult('root')}`);

const root = monkeys.get('root')!.split(' ');
let [equation, result] = [getResult(root[0], false), getResult(root[2], false)];

while (!isHumn(equation)) {
  const [left, right, operator] = equation as Operation;
  if (isNumber(left)) {
    if (operator === '+' || operator === '*') result = eval(result + inverse(operator) + left);
    if (operator === '-' || operator === '/') result = eval(left + operator + result);
    equation = right;
  } else {
    result = eval(result + inverse(operator) + right);
    equation = left;
  }
}

console.log(`Part 2: ${result}`);