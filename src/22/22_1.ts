import fs from 'fs';

type Cell = ' ' | '.' | '#';
enum Turn {
  R = 'R',
  L = 'L',
}
type Move = Turn | number;
type Path = Move[];
type Direction = 0 | 1 | 2 | 3;
type Location = {
  row: number;
  col: number;
  direction: Direction;
};

function directionToArrow(direction: Direction) {
  switch (direction) {
    case 0:
      return '>';
    case 1:
      return 'v';
    case 2:
      return '<';
    case 3:
      return '^';
  }
}

function drawMap(map: Cell[][], locations: Location[]) {
  let output = '';
  map.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const location = locations.find((location) => location.row === rowIndex && location.col === colIndex);
      output += location !== undefined ? directionToArrow(location.direction) : col;
    });
    output += '\n';
  });
  console.log(output);
}

const [mapInput, pathInput]: [string, string] = fs.readFileSync('src/22/input.txt', 'utf-8').split('\n\n') as [
  string,
  string,
];

function parseMoves() {
  let buffer = '';
  let path: Path = [];
  pathInput.split('').forEach((c) => {
    if (isNaN(Number(c))) {
      const turn = c as Turn;
      const distance = Number(buffer);
      path.push(distance, turn);
      buffer = '';
    } else {
      buffer += c;
    }
  });
  if (buffer.length > 0) path.push(Number(buffer));
  return path;
}

function mod(n: number, modulus: number) {
  return ((n % modulus) + modulus) % modulus;
}

function isTurn(move: Move): move is Turn {
  return typeof move === 'string';
}

function turn(location: Location, turn: Turn) {
  const newDirection = turn === Turn.R ? mod(location.direction + 1, 4) : mod(location.direction - 1, 4);
  return { row: location.row, col: location.col, direction: newDirection as Direction };
}

function nextPosition(startIndex: number, line: Cell[], direction: number): number {
  let prevIndex = startIndex;
  let nextIndex = mod(prevIndex + direction, line.length);
  while (true) {
    if (line[nextIndex] === '#') return startIndex;
    if (line[nextIndex] === '.') return nextIndex;
    prevIndex = nextIndex;
    nextIndex = mod(prevIndex + direction, line.length);
  }
}

function moveDistance(location: Location, distance: number): Location {
  let curr = location;
  let next;
  for (let i = 0; i < distance; i++) {
    if (curr.direction % 2 === 0) {
      next = {
        row: curr.row,
        col: nextPosition(curr.col, map[location.row], 1 - curr.direction),
        direction: curr.direction,
      };
    } else {
      next = {
        row: nextPosition(
          curr.row,
          map.flatMap((_, rowIndex) => [map[rowIndex][curr.col]]),
          2 - curr.direction,
        ),
        col: curr.col,
        direction: curr.direction,
      };
    }
    if (next.col === curr.col && next.row === curr.row) return curr;
    curr = next;
  }
  return curr;
}

function password(location: Location) {
  return (location.row + 1) * 1000 + (location.col + 1) * 4 + location.direction;
}

const maxWidth = mapInput.split('\n').reduce((max, line) => Math.max(line.length, max), 0);

const map: Cell[][] = mapInput
  .split('\n')
  .map((line) => [...line.split(''), ...new Array(maxWidth).fill(' ')].slice(0, maxWidth) as Cell[]);
const path = parseMoves();
let location: Location = { row: 0, col: 0, direction: 0 };
const locations = path.map((move) => {
  if (isTurn(move)) location = turn(location, move);
  else location = moveDistance(location, move);
  return location;
});

drawMap(map, locations);

console.log(`Part 1: ${password(locations.pop()!)}`); //103224
