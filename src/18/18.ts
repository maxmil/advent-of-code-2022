import fs from 'fs';

type Cell = {
  x: number,
  y: number,
  z: number
}

const droplet = new Map<number, Map<number, Set<number>>>();

function computeIfAbsent<T>(map: Map<number, T>, key: number, createFn: () => T) {
  if (!map.has(key)) map.set(key, createFn());
  return map.get(key)!;
}

fs.readFileSync('src/18/input.txt', 'utf-8')
  .split('\n')
  .forEach(line => {
    const coords = line.split(',');
    const row = computeIfAbsent(droplet, Number(coords[0]), () => new Map<number, Set<number>>());
    computeIfAbsent(row, Number(coords[1]), () => new Set<number>()).add(Number(coords[2]));
  });

function getAdjacent(cell: Cell): Cell[] {
  return [
    { x: cell.x + 1, y: cell.y, z: cell.z },
    { x: cell.x + 1, y: cell.y, z: cell.z },
    { x: cell.x, y: cell.y + 1, z: cell.z },
    { x: cell.x, y: cell.y - 1, z: cell.z },
    { x: cell.x, y: cell.y, z: cell.z + 1 },
    { x: cell.x, y: cell.y, z: cell.z - 1 },
  ];
}

const openFaces = new Set<Cell>();
Array.from(droplet.entries()).forEach(([x, cols]) =>
  Array.from(cols.entries()).forEach(([y, depths]) =>
    depths.forEach((z =>
      getAdjacent({ x, y, z })
        .filter(cell => !(droplet.get(cell.x)?.get(cell.y)?.has(cell.z) ?? false)).forEach(cell => openFaces.add(cell))))));

console.log(`Part 1: ${openFaces.size}`);
console.log(`Part 2: ${0}`);
