import fs from 'fs';

enum Blizzard {
  Right = '>',
  Left = '<',
  Up = '^',
  Down = 'v',
}

type Wall = '#';
type Cell = Wall | Set<Blizzard>;
type Position = { row: number; col: number };
type Move = { from: Position; to: Position; blizzard: Blizzard };

function isWall(cell: Cell): cell is Wall {
  return cell === '#';
}

function cellToString(cell: Cell) {
  if (isWall(cell)) return cell;
  else if (cell.size === 0) return '.';
  else return cell.size > 1 ? cell.size : Array.from(cell)[0];
}

function drawValley() {
  console.log(valley.reduce((output, row) => output + row.reduce((output, cell) => output + cellToString(cell), '') + '\n', ''));
}

function mod(n: number, m: number) {
  return (n + m) % m;
}

function blizzardMoves(rowIndex: number, colIndex: number, cell: Cell): Move[] {
  if (isWall(cell) || cell.size === 0) return [];
  const from = { row: rowIndex, col: colIndex };
  return Array.from(cell).flatMap((blizzard) => {
    if (blizzard === Blizzard.Up) return [{ from, to: { row: mod(rowIndex - 2, height - 2) + 1, col: colIndex }, blizzard } as Move];
    if (blizzard === Blizzard.Down) return [{ from, to: { row: mod(rowIndex, height - 2) + 1, col: colIndex }, blizzard }];
    if (blizzard === Blizzard.Right) return [{ from, to: { row: rowIndex, col: mod(colIndex, width - 2) + 1 }, blizzard }];
    if (blizzard === Blizzard.Left) return [{ from, to: { row: rowIndex, col: mod(colIndex - 2, width - 2) + 1 }, blizzard }];
    return [];
  });
}

function moveBlizzards() {
  const moves = valley.reduce((moves, row, rowIndex) => [...moves, ...row.reduce((moves: Move[], col, colIndex) => [...moves, ...blizzardMoves(rowIndex, colIndex, col)], [])], [] as Move[]);
  moves.forEach((move) => (valley[move.from.row][move.from.col] as Set<Blizzard>).delete(move.blizzard));
  moves.forEach((move) => (valley[move.to.row][move.to.col] as Set<Blizzard>).add(move.blizzard));
}

function nextPositions(position: Position) {
  return [position, { ...position, row: position.row - 1 }, { ...position, row: position.row - 1 }, { ...position, row: position.col + 1 }, { ...position, row: position.col - 1 }].filter((p) => {
    if (p.row < 0) return false;
    const cell = valley[p.row][p.col];
    return !isWall(cell) && cell.size === 0;
  });
}

const valley: Cell[][] = fs
  .readFileSync('src/24/input_test.txt', 'utf-8')
  .split('\n')
  .reduce(
    (rows: Cell[][], row) => [
      ...rows,
      row.split('').reduce((cols: Cell[], col) => {
        if (col === '#') return [...cols, col];
        else if (col === '.') return [...cols, new Set()];
        else return [...cols, new Set([col as Blizzard])];
      }, []),
    ],
    [],
  );

const width = valley[0].length;
const height = valley.length;

let positions = [{ row: 0, col: 1 }];
let step = 0
while (true) {
    step ++
    moveBlizzards();
    positions = positions.flatMap(position => nextPositions(position))
    console.log(step, positions.length)
    if (positions.find(p => p.row === height && p.col === width - 2)){
        break;
    }
}

console.log(`Part 1: ${step}`)

// drawValley();
