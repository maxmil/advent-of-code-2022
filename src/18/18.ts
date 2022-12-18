import fs from 'fs';

function computeIfAbsent<T>(map: Map<number, T>, key: number, createFn: () => T) {
  if (!map.has(key)) map.set(key, createFn());
  return map.get(key)!;
}

class Cell {

  constructor(public readonly x: number, public readonly y: number, public readonly z: number) {
  }

  getAdjacent(): Cell[] {
    return [
      new Cell(this.x + 1, this.y, this.z),
      new Cell(this.x - 1, this.y, this.z),
      new Cell(this.x, this.y + 1, this.z),
      new Cell(this.x, this.y - 1, this.z),
      new Cell(this.x, this.y, this.z + 1),
      new Cell(this.x, this.y, this.z - 1),
    ];
  }

  toKey() {
    return `${this.x},${this.y},${this.z}`;
  }
}

class Droplet {
  public readonly cells: Map<number, Map<number, Set<number>>> = new Map();
  public minX = Number.POSITIVE_INFINITY;
  public maxX = 0;
  public minY = Number.POSITIVE_INFINITY;
  public maxY = 0;
  public minZ = Number.POSITIVE_INFINITY;
  public maxZ = 0;

  addCell(cell: Cell) {
    this.minX = Math.min(cell.x, this.minX);
    this.maxX = Math.max(cell.x, this.maxX);
    this.minY = Math.min(cell.y, this.minY);
    this.maxY = Math.max(cell.y, this.maxY);
    this.minZ = Math.min(cell.z, this.minZ);
    this.maxZ = Math.max(cell.z, this.maxZ);
    const row = computeIfAbsent(this.cells, cell.x, () => new Map());
    const col = computeIfAbsent(row, cell.y, () => new Set());
    col.add(cell.z);
  }

  inDroplet(cell: Cell) {
    return this.cells.get(cell.x)?.get(cell.y)?.has(cell.z) ?? false;
  }

  reachedBounds(cell: Cell) {
    return cell.x <= this.minX || cell.x >= this.maxX
      || cell.y <= this.minY || cell.y >= this.maxY
      || cell.z <= this.minZ || cell.z >= this.maxZ;
  }
}

const droplet = new Droplet();
fs.readFileSync('src/18/input.txt', 'utf-8')
  .split('\n')
  .forEach(line => {
    const coords = line.split(',');
    droplet.addCell(new Cell(Number(coords[0]), Number(coords[1]), Number(coords[2])));
  });


function getOpenFaces(droplet: Droplet) {
  const openFaces = new Set<Cell>();
  Array.from(droplet.cells.entries()).forEach(([x, cols]) => {
    Array.from(cols.entries()).forEach(([y, depths]) => {
      depths.forEach((z => {
        new Cell(x, y, z).getAdjacent().filter(cell => !droplet.inDroplet(cell)).forEach(cell => openFaces.add(cell));
      }));
    });
  });
  return openFaces;
}


const visited = new Map<string, boolean>();
function isExternalFace(droplet: Droplet, cell: Cell, visiting: string[] = []): boolean {
  const key = cell.toKey();
  if (!visited.has(key)) {
    if (droplet.reachedBounds((cell))) {
      visited.set(key, true);
    } else {
      const adjacent = cell.getAdjacent().filter(adj => !new Set(visiting).has(adj.toKey()) && !droplet.inDroplet(adj));
      visited.set(key, adjacent.find(cell => isExternalFace(droplet, cell, [...visiting, key])) !== undefined);
    }
  }
  return visited.get(key)!;
}

const openFaces = getOpenFaces(droplet);
console.log(`Part 1: ${openFaces.size}`);


const internalFaces = Array.from(openFaces).filter(face => !isExternalFace(droplet, face));
console.log(`Part 2: ${openFaces.size - internalFaces.length}`);