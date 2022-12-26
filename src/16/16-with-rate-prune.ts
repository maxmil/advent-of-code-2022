import fs from 'fs';
import { deflateSync } from 'zlib';

type Valve = { name: string; rate: number; neighbours: Map<string, number> };

const valves = new Map<string, Valve>();

function parseValves() {
  fs.readFileSync('src/16/input_test.txt', 'utf-8')
  .split('\n')
  .map((line) => line.match(/Valve ([A-Z]{2}) has flow rate=(\d+)[a-z;\s]+(.*)/) as string[])
  .map(([_, name, rate, neighbors]) => {
    valves.set(name, { name, rate: Number(rate), neighbours: new Map(neighbors.split(', ').map((name) => [name, 1])) });
  });
}

function removeZeroRateNodes() {
  const valvesWithRateZero = Array.from(valves.values()).filter((v) => v.rate === 0);
  valvesWithRateZero.forEach((valveToSubstitute) => {
    valves.forEach((valve) => {
      if (valve.name === valveToSubstitute.name) valves.delete(valve.name);
      const distToSubstitute = valve.neighbours.get(valveToSubstitute.name);
      if (distToSubstitute) {
        valveToSubstitute.neighbours.forEach((distance, neighbor) => {
          if (neighbor === valve.name) return;
          valve.neighbours.set(neighbor, Math.min(valve.neighbours.get(neighbor) ?? Number.POSITIVE_INFINITY, distToSubstitute + distance));
        });
      }
      valve.neighbours.delete(valveToSubstitute.name);
    });
  });
}

function maxPressure(currValve: string, minutesRemaining: number, closedValves: Set<string>, pressure: number): number {
  const valve = valves.get(currValve)!;
  const neighbours = Array.from(valve.neighbours.entries()).filter(([name, distance]) => closedValves.has(name) && minutesRemaining > distance + 1);
  return neighbours.reduce((max, neighbour) => {
    const [name, dist] = neighbour;
    const timeRemainingAfterOpening = minutesRemaining - dist - 1;
    const closedValvesAfterOpening = new Set(closedValves);
    closedValvesAfterOpening.delete(name);
    const pressureAdded = valves.get(name)!.rate * (minutesRemaining - dist)
    if (name === undefined){
      console.log(neighbour, minutesRemaining)
    }
    return Math.max(max, maxPressure(name, timeRemainingAfterOpening, closedValvesAfterOpening, pressure + pressureAdded), pressure);
  }, pressure)
}

parseValves();
// const startNode = valves.get('AA')!
removeZeroRateNodes();

const initiallyClosed = new Set(Array.from(valves.keys()));
const startingPoints: [string, number][] = [
  ['DD', 1],
  ['JJ', 2],
  ['BB', 1],
];

const pressure = startingPoints.reduce((max, startingPoint) => {
  console.log("Starting from " + startingPoint)
  const [name, dist] = startingPoint;
  return Math.max(max, maxPressure(name, 30 - dist, initiallyClosed, 0));
}, 0)

console.log(pressure);



//https://www.youtube.com/watch?v=DgqkVDr1WX8

