import fs from 'fs';


const input = fs.readFileSync('src/08/input.txt', 'utf8').split('\n').filter(line => line.trim().length > 0);

const cols = input[0].length;
const rows = input.length;

const visible: boolean[][] = [...new Array(cols)].map(_ => new Array(rows));

function fromTopLeft() {
  let highestInCol: number[] = [...new Array(cols)].map(_ => 0);
  for (let row = 0; row < rows; row++) {
    const trees = input[row].split('').map(t => Number(t));
    let highestInRow = 0;
    for (let col = 0; col < trees.length; col++) {
      const height = trees[col];
      if (row === 0 || col === 0 || height > highestInRow || height > highestInCol[col]) {
        visible[row][col] = true;
      }
      highestInCol[col] = Math.max(highestInCol[col], height)
      highestInRow = Math.max(highestInRow, height);
    }
  }
}

function fromBottomRight() {
  let highestInCol: number[] = [...new Array(cols)].map(_ => 0);
  for (let row = rows - 1; row > 0; row--) {
    const trees = input[row].split('').map(t => Number(t));
    let highestInRow = 0;
    for (let col = cols - 1; col > 0; col--) {
      const height = trees[col];
      if (row === rows - 1 || col === cols - 1 || height > highestInRow || height > highestInCol[col]) {
        visible[row][col] = true;
      }
      highestInCol[col] = Math.max(highestInCol[col], height)
      highestInRow = Math.max(highestInRow, height);
    }
  }
}

fromTopLeft();
fromBottomRight();

const treesVisible = visible.flatMap(row => row.flatMap(col => col)).filter(tree => tree).length;
console.log(`Part 1: ${treesVisible}`);
