import fs from 'fs';
import { deflateSync } from 'zlib';

type Valve = { name: string; rate: number; neighbours: Map<string, number> };

const valves = new Map<string, Valve>();

function parseValves() {
  fs.readFileSync('src/16/input.txt', 'utf-8')
    .split('\n')
    .map((line) => line.match(/Valve ([A-Z]{2}) has flow rate=(\d+)[a-z;\s]+(.*)/) as string[])
    .map(([_, name, rate, neighbors]) => {
      valves.set(name, { name, rate: Number(rate), neighbours: new Map(neighbors.split(', ').map((name) => [name, 1])) });
    });
}

function removeZeroRateNonStartNodes() {
  const removeValves = Array.from(valves.values()).filter((v) => v.rate === 0 && v.name !== 'AA');
  removeValves.forEach((removeValve) => {
    valves.forEach((valve) => {
      if (valve.name === removeValve.name) valves.delete(valve.name);
      const distToRemoved = valve.neighbours.get(removeValve.name);
      if (distToRemoved) {
        removeValve.neighbours.forEach((distance, neighbor) => {
          if (neighbor !== valve.name)
            valve.neighbours.set(neighbor, Math.min(valve.neighbours.get(neighbor) ?? Number.POSITIVE_INFINITY, distToRemoved + distance));
        });
      }
      valve.neighbours.delete(removeValve.name);
    });
  });
}

const pressureCache = new Map<string, number>();

function isOpen(valveStates: number, name: string): boolean {
  const keys = Array.from(valves.keys());
  const index = keys.indexOf(name);
  const open = 1 << (keys.length - index);
  return (valveStates & open) !== 0;
}

function openValve(valveStates: number, name: string): number {
  const keys = Array.from(valves.keys());
  const index = keys.indexOf(name);
  const open = 1 << (keys.length - index);
  return valveStates | open;
}

function maxPressure(currValve: string, minutesRemaining: number, valveStates: number, elephant: boolean = false): number {
  if (minutesRemaining === 0) {
    if (elephant) return maxPressure('AA', 26, valveStates, false);
    else return 0;
  }

  const key = `${currValve},${minutesRemaining},${valveStates},${elephant}`;
  const cached = pressureCache.get(key);
  if (cached != undefined) return cached;

  const valve = valves.get(currValve)!;

  let pressureByOpenning = 0;
  if (!isOpen(valveStates, currValve) && valve.rate > 0) {
    const pressureFromValve = valve.rate * (minutesRemaining - 1);
    pressureByOpenning = pressureFromValve + maxPressure(currValve, minutesRemaining - 1, openValve(valveStates, currValve), elephant);
  }

  const pressureByMoving = Array.from(valve.neighbours.entries())
    .filter(([_, distance]) => distance < minutesRemaining - 1)
    .map(([neighbour, distance]) => maxPressure(neighbour, minutesRemaining - distance, valveStates, elephant));

  const pressureByElephant = pressureByMoving.length == 0 && elephant ? maxPressure('AA', 26, valveStates, false) : 0;

  const pressure = [pressureByOpenning, ...pressureByMoving, pressureByElephant].reduce((max, pressure) => Math.max(max, pressure), 0);

  pressureCache.set(key, pressure);
  return pressure;
}

parseValves();
removeZeroRateNonStartNodes();

console.log(`Part 1: ${maxPressure('AA', 30, 0)}`);
console.log(`Part 2: ${maxPressure('AA', 26, 0, true)}`);
