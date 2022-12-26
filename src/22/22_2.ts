import fs, { Dir } from 'fs';

type Cell = ' ' | '.' | '#';
enum Turn {
  R = 'R',
  L = 'L',
}
type Move = Turn | number;
type Path = Move[];
enum Direction { Right = 0, Down = 1, Left = 2, Up = 3 };
type Location = {
  row: number;
  col: number;
  direction: Direction;
};

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

function getFace(row: number, col: number) {
  if (row < quadrantSize) {
    if (col >= 2 * quadrantSize && col < 3 * quadrantSize) return 1;
  }
  if (row < 2 * quadrantSize) {
    if (col < quadrantSize) return 2;
    if (col < 2 * quadrantSize) return 3;
    if (col < 3 * quadrantSize) return 4;
  }

  if (col >= 2 * quadrantSize && col < 3 * quadrantSize) return 5;
  if (col >= 3 * quadrantSize) return 6;
  throw new Error(`(${row}, ${col}) is not on any face`);
}

function nextLocation(location: Location): Location {
  const face = getFace(location.row, location.col);
  const nextRow = location.direction % 2 === 0 ? location.row : mod(location.row + (2 - location.direction), 3 * quadrantSize);
  const nextCol = location.direction % 2 === 0 ? mod(location.col + (1 - location.direction), 4 * quadrantSize) : location.col;
  let nextLocation = { row: nextRow, col: nextCol, direction: location.direction };
  if (face === 1 && nextCol === 2 * quadrantSize - 1) nextLocation = { row: quadrantSize, col: quadrantSize + location.row, direction: 1 }; 
  if (face === 1 && nextCol === 3 * quadrantSize) nextLocation = { row: 3 * quadrantSize - 1 - location.row, col: 4 * quadrantSize - 1, direction: 2 }; 
  if (face === 1 && nextRow === 3 * quadrantSize - 1) nextLocation = { row: quadrantSize, col: quadrantSize - (location.col - 2 * quadrantSize) - 1, direction: 1 };
  if (face === 2 && nextRow === quadrantSize - 1) nextLocation = { row: 0, col: 3 * quadrantSize - location.col - 1, direction: 1 }; 
  if (face === 2 && nextRow === 2 * quadrantSize) nextLocation = { row: 3 * quadrantSize - 1, col: 3 * quadrantSize - location.col - 1, direction: 3 }; 
  if (face === 2 && nextCol === 4 * quadrantSize - 1) nextLocation = { row: 3 * quadrantSize - 1, col: 4 * quadrantSize - (location.row - quadrantSize) - 1, direction: 3 };
  if (face === 3 && nextRow === quadrantSize - 1) nextLocation = { row: location.col - quadrantSize, col: 2 * quadrantSize, direction: 0 };
  if (face === 3 && nextRow === 2 * quadrantSize) nextLocation = { row: 3 * quadrantSize - (location.col - quadrantSize) - 1, col: 2 * quadrantSize, direction: 0 };
  if (face === 4 && nextCol === 3 * quadrantSize) nextLocation = { row: 2 * quadrantSize, col: 4 * quadrantSize - 1 - (location.row - quadrantSize), direction: 1 };
  if (face === 5 && nextCol === 2 * quadrantSize - 1) nextLocation = { row: 2 * quadrantSize - 1, col: 2 * quadrantSize - 1 - (location.row - 2 * quadrantSize), direction: 3 }; 
  if (face === 5 && nextRow === 0) nextLocation = { row: 2 * quadrantSize - 1, col: quadrantSize - 1 - (location.col - 2 * quadrantSize), direction: 3 };
  if (face === 6 && nextCol === 0) nextLocation = { row: quadrantSize - 1 - (location.row - 2 * quadrantSize), col: 3 * quadrantSize - 1, direction: 2 }; 
  if (face === 6 && nextRow === 2 * quadrantSize - 1) nextLocation = { row: 2 * quadrantSize - 1 - (location.col - 3 * quadrantSize), col: 3 * quadrantSize - 1, direction: 2 }; 
  if (face === 6 && nextRow === 0) nextLocation = { row: quadrantSize * 2 - 1 - (location.col - 3 * quadrantSize), col: 0, direction: 0 }; 

  if (map[nextLocation.row][nextLocation.col] === '.') return nextLocation;
  if (map[nextLocation.row][nextLocation.col] === '#') return location;

  throw new Error(`Illegal new location (${nextLocation.row}, ${nextLocation.col}) coming from (${location.row}, ${location.col})`);
}

function moveDistance(location: Location, distance: number): Location {
  let curr = location;
  let next;
  for (let i = 0; i < distance; i++) {
    next = nextLocation(curr);
    if (next.col === curr.col && next.row === curr.row) return curr;
    curr = next;
  }
  return curr;
}

function password(location: Location) {
  return (location.row + 1) * 1000 + (location.col + 1) * 4 + location.direction;
}

const [mapInput, pathInput]: [string, string] = fs.readFileSync('src/22/input_translated.txt', 'utf-8').split('\n\n') as [string, string];

const quadrantSize = mapInput.split('\n').length / 3;
const map: Cell[][] = mapInput.split('\n').map((line) => line.split('') as Cell[]);
const path = parseMoves();
const endLocation = path.reduce((location: Location, move) => {
  if (isTurn(move)) location = turn(location, move);
  else location = moveDistance(location, move);
  return location;
}, { row: 0, col: 2 * quadrantSize, direction: 0 });

console.log(endLocation)
const endQuadrant = getFace(endLocation.row, endLocation.col);
if(endQuadrant === 2) {
  const [row, col] = [
    4 * quadrantSize - endLocation.col - 1,
    endLocation.row - quadrantSize
  ]
  const endLocationTranslated = { row, col, direction: (endLocation.direction + 3) % 4 as Direction };
  console.log(endLocationTranslated)
  console.log(`Part 2: ${password(endLocationTranslated)}`); 
}


//103224 doesn't say if high or low
//86524 too low
//91324 too low
//90265
//73177
//194292
//158092
//157092

// My result is password = 157092 { row: 156, col: 22, direction: Right }
// Correct result is password = 189097 { row: 188, col: 23, direction: Down} 
