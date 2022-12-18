import fs from 'fs';

const droplet = new Map<number, Map<number, Set<number>>>();

function computeIfAbsent<T>(map: Map<number, T>, key: number, createFn: () => T) {
  if (!map.has(key)) {
    map.set(key, createFn());
  }
  return map.get(key)!;
}

fs.readFileSync('src/18/input.txt', 'utf-8')
  .split('\n')
  .forEach(line => {
    const coords = line.split(',');
    const row = computeIfAbsent(droplet, Number(coords[0]), () => new Map<number, Set<number>>());
    computeIfAbsent(row, Number(coords[1]), () => new Set<number>()).add(Number(coords[2]));
  });

let openFaces = 0;
Array.from(droplet.entries()).forEach(([x, cols]) => Array.from(cols.entries()).forEach(([y, depths]) => depths.forEach((z => {
  const adjacent = [
    { x: x + 1, y, z },
    { x: x + 1, y, z },
    { x, y: y + 1, z },
    { x, y: y - 1, z },
    { x, y, z: z + 1 },
    { x, y, z: z - 1 },
  ];
  openFaces += adjacent.filter(cell => !(droplet.get(cell.x)?.get(cell.y)?.has(cell.z) ?? false)).length;
}))));

console.log(`Part 1: ${openFaces}`);
console.log(`Part 2: ${0}`);
