import fs from 'fs';

type Pos = {
  x: number
  y: number
}

function moveKnot(knot: Pos, direction: string) {
  if (direction === 'R') return { x: knot.x + 1, y: knot.y };
  else if (direction === 'D') return { x: knot.x, y: knot.y + 1 };
  else if (direction === 'L') return { x: knot.x - 1, y: knot.y };
  else return { x: knot.x, y: knot.y - 1 };
}

function followKnot(leader: Pos, follower: Pos) {
  const newPos = { x: follower.x, y: follower.y };
  const diffX = Math.abs(leader.x - follower.x);
  const diffY = Math.abs(leader.y - follower.y);
  if (diffX > 1 || diffY > 1) {
    if (diffX > 1) {
      newPos.x += leader.x > follower.x ? 1 : -1;
      if (diffY > 0) {
        newPos.y += leader.y > follower.y ? 1 : -1;
      }
    } else {
      newPos.y += leader.y > follower.y ? 1 : -1;
      if (diffX > 0) {
        newPos.x += leader.x > follower.x ? 1 : -1;
      }
    }
  }
  return newPos;
}

function moveRope(tails: Pos[], moves: [string, number][]): number {
  let head = { x: 0, y: 0 };
  const tailPositions = new Set();
  moves.forEach(([direction, distance]) => {
    for (let i = 0; i < distance; i++) {
      head = moveKnot(head, direction);
      for (let j = 0; j < tails.length; j++) {
        tails[j] = j === 0 ? followKnot(head, tails[j]) : followKnot(tails[j - 1], tails[j]);
      }
      const tail = tails[tails.length - 1];
      tailPositions.add(`${tail.x},${tail.y}`);
    }
  });
  return tailPositions.size;
}

const input = fs.readFileSync('src/09/input.txt', 'utf8').split('\n').filter(line => line.trim().length > 0);
const moves: [string, number][] = input.map(line => {
  const parts = line.split(' ');
  return [parts[0], Number(parts[1])];
});

console.log(`Part 1: ${moveRope([{ x: 0, y: 0 }], moves)}`);
console.log(`Part 2: ${moveRope([...new Array(9)].map(_ => ({ x: 0, y: 0 })), moves)}`);
