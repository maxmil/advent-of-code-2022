import { hasSubscribers } from 'diagnostics_channel';
import fs from 'fs';

type Crater = Map<number, Set<number>>;

type Position = {
  row: number;
  col: number;
};

type Move = {
  from: Position;
  to: Position;
};

enum Direction {
  North = 0,
  South = 1,
  West = 2,
  East = 3,
}

function getOrCreateRow(rowIndex: number) {
  if (!crater.has(rowIndex)) crater.set(rowIndex, new Set<number>());
  return crater.get(rowIndex)!;
}

function positions(position: Position, direction: Direction) {
  if (direction < 2)
    return Array.from([0, 1, 2], (i) => ({ row: position.row - 1 + 2 * direction, col: position.col + 1 - i }));
  else
    return Array.from([0, 1, 2], (i) => ({ row: position.row + 1 - i, col: position.col - 1 - 2 * (2 - direction) }));
}

function getMoves(round: number) {
  const moves = new Map<string, Move>();
  crater.forEach((cols, row) =>
    cols.forEach((col) => {
      const elfMoves = Array.from([0, 1, 2, 3])
        .map((i) => positions({ row, col }, (round + i) % 4))
        .filter((positions) => positions.find((p) => crater.get(p.row)?.has(p.col)) === undefined)
        .map((positions) => positions[1]);
      if (elfMoves.length > 0 && elfMoves.length < 4) {
        const move = { from: { row, col }, to: { row: elfMoves[0].row, col: elfMoves[0].col } };
        const positionKey = `${move.to.row},${move.to.col}`;
        if (moves.has(positionKey)) moves.delete(positionKey);
        else moves.set(positionKey, move);
      }
    }),
  );
  return moves;
}

function moveElves(round: number) {
  const moves = getMoves(round);
  moves.forEach((move) => {
    crater.get(move.from.row)!.delete(move.from.col);
    getOrCreateRow(move.to.row).add(move.to.col);
  });
  return moves.size;
}

function bounds() {
  const minRow = Array.from(crater.keys()).sort((a, b) => a - b)[0];
  const maxRow = Array.from(crater.keys()).sort((a, b) => b - a)[0];
  const minCol = Array.from(crater.values())
    .filter((cols) => cols.size > 0)
    .reduce((min, cols) => Math.min(min, Array.from(cols.values()).sort((a, b) => a - b)[0]), Number.POSITIVE_INFINITY);
  const maxCol = Array.from(crater.values())
    .filter((cols) => cols.size > 0)
    .reduce((max, cols) => Math.max(max, Array.from(cols.values()).sort((a, b) => b - a)[0]), 0);
  return [
    { row: minRow, col: minCol },
    { row: maxRow, col: maxCol },
  ];
}

function drawCreater() {
  let output = '';
  const [min, max] = bounds();
  for (let row = min.row; row <= max.row; row++) {
    for (let col = min.col; col <= max.col; col++) {
      output += crater.get(row)?.has(col) ? '#' : '.';
    }
    output += '\n';
  }

  console.log(output);
  console.log();
}

function emptyTiles() {
  const elves = Array.from(crater.values()).reduce((cnt, cols) => cnt + cols.size, 0);
  const [min, max] = bounds();
  return (max.row - min.row + 1) * (max.col - min.col + 1) - elves;
}

const input = fs.readFileSync('src/23/input.txt', 'utf-8').split('\n');
const crater = new Map<number, Set<number>>();
input.forEach((line, rowIndex) =>
  line.split('').forEach((c, colIndex) => {
    if (c === '#') getOrCreateRow(rowIndex).add(colIndex);
  }),
);

let round = 0;
while (moveElves(round) > 0) {
  round++;
  if (round === 10) console.log(`Part 1: ${emptyTiles()}`);
}
console.log(`Part 2: ${round + 1}`);
