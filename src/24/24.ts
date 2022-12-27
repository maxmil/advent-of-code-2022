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
  const moves = valley.reduce(
    (moves, row, rowIndex) => [...moves, ...row.reduce((moves: Move[], col, colIndex) => [...moves, ...blizzardMoves(rowIndex, colIndex, col)], [])],
    [] as Move[],
  );
  moves.forEach((move) => (valley[move.from.row][move.from.col] as Set<Blizzard>).delete(move.blizzard));
  moves.forEach((move) => (valley[move.to.row][move.to.col] as Set<Blizzard>).add(move.blizzard));
}

function isExitPosition(position: Position) {
  return position.row === exitPosition.row && position.col === exitPosition.col;
}

function nextPositions(position: Position, state: Set<string>) {
  return [
    { ...position, row: position.row + 1 },
    { ...position, col: position.col + 1 },
    position,
    { ...position, row: position.row - 1 },
    { ...position, col: position.col - 1 },
  ].filter((p) => state.has(`${p.row},${p.col}`) || isExitPosition(p));
}

const valley: Cell[][] = fs
  .readFileSync('src/24/input.txt', 'utf-8')
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

function move(position: Position, step: number) {
  if (step > shortest) return;
  if (isExitPosition(position)) {
    shortest = Math.min(shortest, step);
    return;
  }

  const key = `${position.row},${position.col},${step}`;
  if (visited.has(key)) return;
  visited.add(key);

  let state = valleyState.get(step);
  if (state === undefined) {
    moveBlizzards();
    state = new Set(
      valley.flatMap(
        (row, rowIndex) =>
          row.map((cell, colIndex) => (!isWall(cell) && cell.size === 0 ? `${rowIndex},${colIndex}` : undefined)).filter((s) => s !== undefined) as string[],
      ),
    );
    valleyState.set(step, state);
  }

  nextPositions(position, state).forEach((p) => move(p, step + 1));
}


const valleyState = new Map<number, Set<string>>();
const visited = new Set<string>();
const width = valley[0].length;
const height = valley.length;
const exitPosition = { row: height - 1, col: width - 2 };
let shortest = 1000;

move({ row: 0, col: 1 }, 0);
console.log(`Part 1: ${shortest}`);