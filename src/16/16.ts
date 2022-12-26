import fs from 'fs';
import { deflateSync } from 'zlib';

type Valve = { name: string; rate: number; neighbours: string[] };

const pressureCache = new Map<string, number>();

function maxPressure(currValve: string, minutesRemaining: number, openedValves: Set<string>): number {
  if (minutesRemaining < 2) return 0;
  const key = `${currValve},${minutesRemaining},${Array.from(openedValves).join('')}`;
  if (pressureCache.has(key)) return pressureCache.get(key)!;

  const valve = valves.get(currValve)!;
  let pressureFromOpening = 0;
  if (!openedValves.has(currValve) && valve.rate > 0) {
    const newOpenedValves = new Set(openedValves);
    newOpenedValves.add(currValve);
    const newPressureFromOpenning = valve.rate * (minutesRemaining - 1);
    pressureFromOpening = newPressureFromOpenning + maxPressure(currValve, minutesRemaining - 1, newOpenedValves);
  }
  
  const pressure = valve.neighbours
    .map((neighbour) => maxPressure(neighbour, minutesRemaining - 1, openedValves))
    .reduce((max, pressure) => Math.max(max, pressure), pressureFromOpening);

  pressureCache.set(key, pressure);
  return pressure;
}
const input = fs.readFileSync('src/16/input.txt', 'utf-8').split('\n');
const valves = new Map(
  input
    .map((line) => line.match(/Valve ([A-Z]{2}) has flow rate=(\d+)[a-z;\s]+(.*)/) as string[])
    .map(([_, name, rate, neighbors]) => [name, { name, rate: Number(rate), neighbours: neighbors.split(', ') }]),
);

console.log(`Part 1: ${maxPressure('AA', 30, new Set())}`);
