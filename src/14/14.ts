import fs from 'fs';

type Cell = { row: number, col: number }

const walls: Cell[][] = fs.readFileSync('src/14/input.txt', 'utf8')
  .split('\n')
  .filter(line => line.trim().length > 0)
  .map((line) =>
    line.split(' -> ')
      .map((coords) => {
        const coordinates = coords.split(',');
        return { row: Number(coordinates[1]), col: Number(coordinates[0]) };
      }));

// console.log(walls);

const [minCol, maxCol, maxRow] = walls.flatMap((wall) => wall).reduce(([minCol, maxCol, maxRow], cell) => {
  return [
    Math.min(minCol, cell.col),
    Math.max(maxCol, cell.col),
    Math.max(maxRow, cell.row),
  ];
}, [Number.POSITIVE_INFINITY, 0, 0]);

// console.log(minCol, maxCol, maxRow)

function drawCave(cave: string[][]) {
  let output = '';
  cave.forEach(cols => {
    cols.forEach((cell, i) => {
      if (i >= minCol) output += cell;
    });
    output += '\n';
  });
  console.log(output);
}

function addWall(wall: Cell[], cave: string[][]) {
  let lastVertex = wall[0];
  cave[lastVertex.row][lastVertex.col] = '#';
  wall.slice(1).forEach(vertex => {
    const distY = vertex.row - lastVertex.row;
    const distX = vertex.col - lastVertex.col;
    if (distX !== 0) {
      let col = lastVertex.col;
      do {
        col = distX > 0 ? col + 1 : col - 1;
        cave[lastVertex.row][col] = '#';
      } while (vertex.col != col);
    } else if (distY !== 0) {
      let row = lastVertex.row;
      do {
        row = distY > 0 ? row + 1 : row - 1;
        cave[row][lastVertex.col] = '#';
      } while (vertex.row != row);
    }
    lastVertex = vertex;
  });
}

function addWalls(cave: string[][]) {
  walls.forEach(vertices => addWall(vertices, cave));
}

function isInTheVoid(cell: Cell, cave: string[][]) {
  return cell.row > maxRow || cell.col < minCol || cell.col > maxCol;
}

function dropSand(cave: string[][]): Cell {
  let pos = { row: 0, col: 500 };
  while (true) {
    const down = { row: pos.row + 1, col: pos.col };
    if (isInTheVoid(down, cave)) return down;
    if (cave[down.row][down.col] === '.') {
      pos = down;
      continue;
    }
    const downLeft = { row: pos.row + 1, col: pos.col - 1 };
    if (isInTheVoid(downLeft, cave)) return downLeft;
    if (cave[downLeft.row][downLeft.col] === '.') {
      pos = downLeft;
      continue;
    }
    const downRight = { row: pos.row + 1, col: pos.col + 1 };
    if (isInTheVoid(downRight, cave)) return downRight;
    if (cave[downRight.row][downRight.col] === '.') {
      pos = downRight;
      continue;
    }
    cave[pos.row][pos.col] = 'o';
    return pos;
  }
}

function part1() {
  const cave: string[][] = [...new Array(maxRow + 1)].map(_ => new Array(maxCol + 1).fill('.'));
  addWalls(cave);
  let sand = 0;
  while (!isInTheVoid(dropSand(cave), cave)) sand++;
  drawCave(cave);
  console.log(`Part 1: ${sand}`);
}

function part2() {
  const [minCol, maxCol, maxRow] = walls.flatMap((wall) => wall).reduce(([minCol, maxCol, maxRow], cell) => {
    return [
      Math.min(minCol, cell.col - cell.row - 2),
      Math.max(maxCol, cell.col + cell.row + 2),
      Math.max(maxRow, cell.row + 2),
    ];
  }, [Number.POSITIVE_INFINITY, 0, 0]);
  const cave: string[][] = [...new Array(maxRow + 1)].map(_ => new Array(maxCol + 1).fill('.'));
  addWalls(cave);
  addWall([
    { row: maxRow, col: minCol},
    { row: maxRow, col: maxCol},
  ], cave);

  let sand = 0;
  while(cave[0][500] === '.'){
    dropSand(cave);
    drawCave(cave);
    sand ++;
  }
  drawCave(cave);
  console.log(`Part 2: ${sand}`);
}


// part1();
part2();




