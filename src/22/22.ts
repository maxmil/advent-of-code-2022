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

function getQuadrant(row: number, col: number) {
  if (row < quadrantSize) {
    if (col >= 2 * quadrantSize && col < 3 * quadrantSize) return 1;
    return undefined;
  }
  if (row < 2 * quadrantSize) {
    if (col < quadrantSize) return 2;
    if (col < 2 * quadrantSize) return 3;
    if (col < 3 * quadrantSize) return 4;
    return undefined;
  }
  
  if (col >= 2 * quadrantSize && col < 3 * quadrantSize) return 5;
  if (col >= 3 * quadrantSize) return 6;
  return undefined;
}

function nextLocation(location: Location): Location {
  const quadrant = getQuadrant(location.row, location.col);
  const nextRow =
    location.direction % 2 === 0 ? location.row : mod(location.row + (2 - location.direction), 3 * quadrantSize);
  const nextCol =
    location.direction % 2 === 0 ? mod(location.col + (1 - location.direction), 4 * quadrantSize) : location.col;
  console.log(`nextRow ${nextRow}, nextCol ${nextCol} = ${map[nextRow][nextCol]}`);
  let nextLocation = { row: nextRow, col: nextCol, direction: location.direction };
  if (quadrant === 1 && nextCol === 2 * quadrantSize - 1)
    nextLocation = { row: quadrantSize, col: quadrantSize + location.row, direction: 1 };
  if (quadrant === 1 && nextCol === 3 * quadrantSize)
    nextLocation = { row: 3 * quadrantSize - 1 - location.row, col: 4 * quadrantSize - 1, direction: 2 };
  if (quadrant === 2 && nextRow === quadrantSize - 1)
    nextLocation = { row: 0, col: 3 * quadrantSize - 1 - location.col, direction: 1 };
  if (quadrant === 2 && nextRow === 2 * quadrantSize)
    nextLocation = { row: 3 * quadrantSize - 1, col: 3 * quadrantSize - 1 - location.col, direction: 3 };
  if (quadrant === 2 && nextCol === 4 * quadrantSize - 1)
    nextLocation = { row: 3 * quadrantSize - 1, col: 4 * quadrantSize - 1 - location.row, direction: 3 };
  if (quadrant === 3 && nextRow === quadrantSize - 1)
    nextLocation = { row: location.col - quadrantSize, col: 2 * quadrantSize, direction: 0 };
  if (quadrant === 3 && nextRow === 2 * quadrantSize)
    nextLocation = { row: 3 * quadrantSize - 1 - (location.col - quadrantSize), col: 2 * quadrantSize, direction: 0 };
  if (quadrant === 4 && nextCol === 3 * quadrantSize)
    nextLocation = { row: 2 * quadrantSize, col: 4 * quadrantSize - 1 - (location.row - quadrantSize), direction: 1 };
  if (quadrant === 5 && nextCol === 2 * quadrantSize - 1)
    nextLocation = {
      row: 2 * quadrantSize - 1,
      col: 2 * quadrantSize - 1 - (location.row - 2 * quadrantSize),
      direction: 3,
    };
  if (quadrant === 5 && nextRow === 0)
    nextLocation = {
      row: 2 * quadrantSize - 1,
      col: quadrantSize - 1 - (location.col - 2 * quadrantSize),
      direction: 3,
    };
  if (quadrant === 6 && nextCol === 0)
    nextLocation = {
      row: quadrantSize - 1 - (location.row - 2 * quadrantSize),
      col: 3 * quadrantSize - 1,
      direction: 2,
    };
  if (quadrant === 6 && nextRow === 2 * quadrantSize - 1)
    nextLocation = {
      row: 2 * quadrantSize - 1 - (location.col - 2 * quadrantSize),
      col: 3 * quadrantSize - 1,
      direction: 2,
    };
  if (map[nextLocation.row][nextLocation.col] === '.') return nextLocation;
  if (map[nextLocation.row][nextLocation.col] === '#') return location;

  throw new Error(`Unexpected new location ${quadrant}: ${nextRow}, ${nextCol}`);
}

function moveDistance(location: Location, distance: number): Location {
  let curr = location;
  let next;
  for (let i = 0; i < distance; i++) {
    next = nextLocation(curr);
    // drawMap(map, [next])
    if (next.col === curr.col && next.row === curr.row) return curr;
    curr = next;
  }
  return curr;
}

function password(location: Location) {
  return (location.row + 1) * 1000 + (location.col + 1) * 4 + location.direction;
}

const quadrantSize = mapInput.split('\n')[0].length / 3;
console.log(quadrantSize);

const map: Cell[][] = mapInput.split('\n').map((line) => line.split('') as Cell[]);
const path = parseMoves();
let location: Location = { row: 0, col: 2 * quadrantSize, direction: 0 };
const locations = path.map((move) => {
  if (isTurn(move)) location = turn(location, move);
  else location = moveDistance(location, move);
  console.log('Moved ', location);
  return location;
});

// drawMap(map, locations);

console.log(`Part 2: ${password(locations.pop()!)}`); //103224
