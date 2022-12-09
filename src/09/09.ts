import fs from 'fs';

type Pos = { x: number, y: number }
type Dir = 'R' | 'D' | 'L' | 'U'

function moveKnot(knot: Pos, direction: Dir) {
  if (direction === 'R') return { x: knot.x + 1, y: knot.y };
  else if (direction === 'D') return { x: knot.x, y: knot.y + 1 };
  else if (direction === 'L') return { x: knot.x - 1, y: knot.y };
  else return { x: knot.x, y: knot.y - 1 };
}

function followKnot(leader: Pos, follower: Pos) {
  const pos = { x: follower.x, y: follower.y };
  const diffX = Math.abs(leader.x - follower.x);
  const diffY = Math.abs(leader.y - follower.y);
  if (diffX > 1 || diffY > 1) {
    if (diffX > 1) {
      pos.x += leader.x > follower.x ? 1 : -1;
      if (diffY > 0) {
        pos.y += leader.y > follower.y ? 1 : -1;
      }
    } else {
      pos.y += leader.y > follower.y ? 1 : -1;
      if (diffX > 0) {
        pos.x += leader.x > follower.x ? 1 : -1;
      }
    }
  }
  return pos;
}

function moveRope(knots: Pos[], moves: [Dir, number][]): number {
  const tailPositions = new Set();
  moves.forEach(([direction, distance]) => {
    for (let i = 0; i < distance; i++) {
      knots.forEach((knot, i) => knots[i] = (i === 0) ? moveKnot(knot, direction) : followKnot(knots[i - 1], knot));
      const tail = knots[knots.length - 1];
      tailPositions.add(`${tail.x},${tail.y}`);
    }
  });
  return tailPositions.size;
}

function initKnots(knots: number) {
  return new Array(knots + 1).fill({ x: 0, y: 0 });
}

const moves: [Dir, number][] = fs.readFileSync('src/09/input.txt', 'utf8').split('\n')
  .filter(line => line.trim().length > 0)
  .map(line => [line.charAt(0) as Dir, Number(line.substring(2))]);

console.log(`Part 1: ${moveRope(initKnots(1), moves)}`);
console.log(`Part 2: ${moveRope(initKnots(9), moves)}`);
