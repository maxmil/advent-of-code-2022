import fs from 'fs';

const debug = false;

type Cell = { x: number, y: number }
const startPos = { x: 500, y: 0 };

const walls = fs.readFileSync('src/14/input.txt', 'utf8')
  .split('\n')
  .filter(line => line.trim().length > 0)
  .map((line) =>
    line.split(' -> ')
      .map((coords) => {
        const coordinates = coords.split(',');
        return { x: Number(coordinates[0]), y: Number(coordinates[1]) };
      }));

function createCave(extraRows = 0) {
  const maxY = walls.flatMap((wall) => wall).reduce((maxY, cell) => Math.max(maxY, cell.y + extraRows), 0);
  const maxX = startPos.x + maxY;
  const cave = [...new Array(maxY + 1)].map(_ => new Array(maxX + 1).fill('.'));
  walls.forEach(vertices => addWall(vertices, cave));
  return cave;
}

function drawCave(cave: string[][]) {
  let output = '';
  cave.forEach(row => {
    row.forEach((cell, i) => output += (i > startPos.x - cave.length) ? cell : '');
    output += '\n';
  });
  if (debug) console.log(output);
}

function addWall(wall: Cell[], cave: string[][]) {
  let prevVertex = wall[0];
  cave[prevVertex.y][prevVertex.x] = '#';
  wall.slice(1).forEach(vertex => {
    const distX = vertex.x - prevVertex.x;
    const distY = vertex.y - prevVertex.y;
    const incX = distX > 0 ? 1 : distX < 0 ? -1 : 0;
    const incY = distY > 0 ? 1 : distY < 0 ? -1 : 0;
    let pos = prevVertex;
    do {
      pos = { x: pos.x + incX, y: pos.y + incY };
      cave[pos.y][pos.x] = '#';
    } while (vertex.x != pos.x || vertex.y != pos.y);
    prevVertex = vertex;
  });
}

function isInTheVoid(cell: Cell, cave: string[][]) {
  return cell.y >= cave.length;
}

function dropSand(cave: string[][]): Cell {
  let pos = startPos;
  while (true) {
    const next = [
      { x: pos.x, y: pos.y + 1 },
      { x: pos.x - 1, y: pos.y + 1 },
      { x: pos.x + 1, y: pos.y + 1 },
    ].filter(cell => isInTheVoid(cell, cave) || cave[cell.y][cell.x] === '.');
    if (next.length === 0) {
      cave[pos.y][pos.x] = 'o';
      return pos;
    }
    pos = next[0];
    if (isInTheVoid(pos, cave)) return pos;
  }
}

function part1() {
  const cave = createCave();
  let sand = 0;
  while (!isInTheVoid(dropSand(cave), cave)) sand++;
  drawCave(cave);
  console.log(`Part 1: ${sand}`);
}

function part2() {
  const cave = createCave(2);
  addWall([
    { x: startPos.y - cave.length + 1, y: cave.length - 1 },
    { x: cave[0].length - 1, y: cave.length - 1 },
  ], cave);
  let sand = 0;
  while (cave[startPos.y][startPos.x] === '.') {
    dropSand(cave);
    sand++;
  }
  drawCave(cave);
  console.log(`Part 2: ${sand}`);
}

part1();
part2();




