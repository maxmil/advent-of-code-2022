import fs from 'fs';

class Point {
  public readonly height: number;

  constructor(public readonly x: number, public readonly y: number, public readonly character: string) {
    this.height = this.character === 'S' ? 'a'.charCodeAt(0) : ((this.character === 'E') ? 'z'.charCodeAt(0) : this.character.charCodeAt(0));
  }

  coordinates() {
    return `${this.x},${this.y}`;
  }
}

const grid: Point[][] = fs.readFileSync('src/12/input.txt', 'utf8')
  .split('\n')
  .filter(line => line.trim().length > 0)
  .map((line, rowIndex) =>
    line.split('').map((c, colIndex) => new Point(rowIndex, colIndex, c)),
  );

function pointsByCharacter(character: string) {
  return grid.flatMap(row => row).filter(point => point.character === character);
}

function countSteps(start: Point, end: Point) {
  let visited = new Set<string>();
  let points: Point[] = [start];
  let steps = 0;
  while (true) {
    if (points.length === 0) return Number.POSITIVE_INFINITY;
    if (points.find(p => p.x === end.x && p.y === end.y)) return steps;
    const nextPoints = points.flatMap(point =>
      [-1, 1].flatMap(i => [[point.x + i, point.y], [point.x, point.y + i]])
        .filter(([x, y]) => x >= 0 && x < grid.length && y >= 0 && y < grid[0].length)
        .map(([x, y]) => grid[x][y])
        .filter(n => n.height <= point.height + 1 && !visited.has(n.coordinates())),
    ).filter((value, index, self) => self.indexOf(value) === index);
    points.forEach(p => visited.add(p.coordinates()));
    points = nextPoints;
    steps++;
  }
}

const end = pointsByCharacter('E')[0];

console.log(`Part 1: ${countSteps(pointsByCharacter('S')[0], end)}`);

const minSteps = pointsByCharacter('a').reduce(
  (min, point) => Math.min(min, countSteps(point, end)),
  Number.POSITIVE_INFINITY,
);
console.log(`Part 2: ${minSteps}`);


