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

function nextPositions(position: Position, end: Position, state: Set<string>) {
  const y = (end.row - position.row) >= 0 ? 1 : -1
  const x = (end.col - position.col) >= 0 ? 1 : -1
  return [
    { ...position, row: position.row + y },
    { ...position, col: position.col + x },
    position,
    { ...position, row: position.row - y },
    { ...position, col: position.col - x },
  ].filter((p) => state.has(`${p.row},${p.col}`) || 
    (p.row === end.row && p.col === end.col));
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

function findShortestPath(start: Position, step:number, end: Position):number {
  function move(position: Position, step: number): number | undefined {
    if (step > shortest) return undefined;
    if (position.row === end.row && position.col === end.col) {
      shortest = Math.min(shortest, step);
      return step;
    }

    const key = `${position.row},${position.col},${step}`;
    if (visited.has(key)) return visited.get(key);

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

    const steps = nextPositions(position, end, state).reduce((shortest, p) => Math.min(shortest, move(p, step + 1) ?? shortest), Number.POSITIVE_INFINITY);
    visited.set(key, Math.min(visited.get(key) ?? steps, steps));
    return steps
  }

  const visited = new Map<string, number>();
  let shortest = 1000;
  return move(start, step)!;
}

const valleyState = new Map<number, Set<string>>();
const width = valley[0].length;
const height = valley.length;

const stepsToExit = findShortestPath({ row: 0, col: 1 }, 0, { row: height - 1, col: width - 2 });
console.log(`Part 1: ${stepsToExit}`);

const stepsBackToBeginning = findShortestPath({ row: height - 1, col: width - 2 }, stepsToExit, { row: 0, col: 1 });
const stepsBackToExit = findShortestPath({ row: 0, col: 1 }, stepsBackToBeginning, { row: height - 1, col: width - 2 });
console.log(`Part 2: ${stepsBackToExit}`)