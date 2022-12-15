import fs from 'fs';

type Cell = {
  x: number
  y: number
}

type Sensor = {
  cell: Cell
  beacon: Cell
  dist: number
}

const sensors: Sensor[] = fs.readFileSync('src/15/input.txt', 'utf-8')
  .split('\n')
  .map(line => line.match(/.*x=([^,]+).*y=([^:]+):.*x=([^,]+).*y=(.+)/) as string[])
  .map(([_, sensorX, sensorY, beaconX, beaconY]) => [Number(sensorX), Number(sensorY), Number(beaconX), Number(beaconY)])
  .map(([sensorX, sensorY, beaconX, beaconY]) => ({
    cell: { x: sensorX, y: sensorY },
    beacon: { x: beaconX, y: beaconY },
    dist: Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY),
  }));

function noBeaconsInRow(rowNumber: number): number {
  const beaconsInRow = new Set(sensors.filter(({ beacon }) => beacon.y === rowNumber).map(({ beacon }) => beacon.x));
  const sensorsInRow = new Set(sensors.filter((sensor) => sensor.cell.x === rowNumber).map((sensor) => sensor.cell.x));
  const noBeaconsInRow = new Set();
  const [minX, maxX] = sensors.reduce(([minX, maxX], sensor) =>
      [Math.min(minX, sensor.cell.x - sensor.dist), Math.max(maxX, sensor.cell.x + sensor.dist)],
    [Number.POSITIVE_INFINITY, 0]);
  for (let x = minX; x <= maxX; x++) {
    if (beaconsInRow.has(x) || sensorsInRow.has(x)) continue;
    const found = sensors.find(sensor => Math.abs(sensor.cell.x - x) + Math.abs(sensor.cell.y - rowNumber) <= sensor.dist);
    if (found) noBeaconsInRow.add(x);
  }
  return noBeaconsInRow.size;
}

function searchPerimeter(sensor: Sensor, maxBounds: number): Cell | undefined {
  for (let x = -(sensor.dist + 1); x <= sensor.dist + 1; x++) {
    const xPos = sensor.cell.x + x;
    if (xPos < 0 || xPos > maxBounds) continue;
    const yInc = (sensor.dist + 1) - Math.abs(x);
    for (const direction of [-1, 1]) {
      const yPos = sensor.cell.y + (yInc * direction);
      if (yPos < 0 || yPos > maxBounds) continue;
      let found = sensors.find((other) => Math.abs(other.cell.x - (xPos)) + Math.abs(other.cell.y - (yPos)) <= other.dist);
      if (found === undefined) {
        return { x: xPos, y: yPos };
      }
    }
  }
}

function tuningFrequency(maxBounds: number): Number | undefined {
  for (const sensor of sensors) {
    const found = searchPerimeter(sensor, maxBounds);
    if (found) return found.x * 4000000 + found.y;
  }
}

console.log(`Part 1: ${noBeaconsInRow(2000000)}`);
console.log(`Part 2: ${tuningFrequency(4000000)}`);
