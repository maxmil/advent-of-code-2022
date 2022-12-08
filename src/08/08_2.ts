import fs from 'fs';


const input = fs.readFileSync('src/08/input.txt', 'utf8').split('\n').filter(line => line.trim().length > 0);

const cols = input[0].length;
const rows = input.length;

type ViewingDistance = {
  up: number
  right: number
  down: number
  left: number
}

const trees: number[][] = [...new Array(cols)].map(_ => new Array(rows));
input.forEach((line, row) => {
  line.split('').forEach((height, col) => trees[row][col] = Number(height));
});

function viewingDistance(fromRow: number, fromCol: number, height: number, moveCol: (n: number) => number, moveRow: (n: number) => number) {
  let distance = 0;
  let row = fromRow;
  let col = fromCol;
  while (moveRow(row) >= 0 && moveRow(row) < rows && moveCol(col) >= 0 && moveCol(col) < cols) {
    distance++;
    col = moveCol(col);
    row = moveRow(row);
    if (trees[row][col] >= height) break;
  }
  return distance;
}

const viewingDistances: ViewingDistance[][] = trees.map((rowOfTrees, row) => {
  return rowOfTrees.map((height, col) => {
    const up = viewingDistance(row, col, height, (n: number) => n, (n: number) => n - 1);
    const right = viewingDistance(row, col, height, (n: number) => n + 1, (n: number) => n);
    const down = viewingDistance(row, col, height, (n: number) => n, (n: number) => n + 1);
    const left = viewingDistance(row, col, height, (n: number) => n - 1, (n: number) => n);
    return { up, right, down, left };
  });
});

const scenicScore = viewingDistances.flatMap((distances) => distances.flatMap((d) => d.up * d.right * d.down * d.left));
console.log(`Part 2: ${scenicScore.reduce((max, s) => Math.max(max, s), 0)}`);
