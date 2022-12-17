import fs from 'fs';

class Valve {

  constructor(public name: string, public rate: number = 0, public neighbors: Map<string, Valve> = new Map()) {
  }

}

const valves = new Map<string, Valve>();

function computeIfAbsent(name: string) {
  if (valves.has(name)) return valves.get(name)!;
  const valve = new Valve(name);
  valves.set(name, valve);
  return valve;
}

fs.readFileSync('src/16/input_test.txt', 'utf-8')
  .split('\n')
  .map(line => (line.match(/Valve ([A-Z]{2}) has flow rate=(\d+)[a-z;\s]+(.*)/) as string[]))
  .map(([_, name, rate, neighbors]) => {
    const valve = computeIfAbsent(name);
    valve.rate = Number(rate);
    neighbors.split(', ').forEach((neighborName) => {
      const neighbor = computeIfAbsent(neighborName);
      neighbor.neighbors.set(name, valve);
      valve.neighbors.set(neighborName, neighbor);
    });
  });


/*

From current valve,
  for each other valve
    pressure added = (time - distance) * rate
    chose top

If pressure added is like distance in Dijkstras then it's find the longest instead of the shortest

 */

/*
 Move towards valve with max (rate - distance), dest
 On the way at each valve ask if it's worth opening
  Worth it, if (pressure from opening valve) = (distance valve -> dest) * valve.rate > dest.rate
 */

// console.log(valves);

function openAndVisit(valve: Valve, neighbor: Valve, minutesRemaining: number, pressure: number) {
  //TODO: Keep track of opened valves
  const newPressure = pressure + (valve.rate * minutesRemaining - 1);
  return visitValve(neighbor, minutesRemaining - 2, newPressure);
}

let done = 0

function visitValve(valve: Valve, minutesRemaining: number, pressure: number): number {
  if (minutesRemaining < 2) return pressure;
  return Array.from(valve.neighbors.values()).flatMap((neighbor) => [
    visitValve(neighbor, minutesRemaining - 1, pressure),
    openAndVisit(valve, neighbor, minutesRemaining, pressure),
  ])
    .reduce((max, curr) => Math.max(max, curr), 0);
}

const maxPressure = visitValve(valves.get('AA')!, 30, 0);

console.log(`Part 1: ${maxPressure}`);
// console.log(`Part 2: ${2}`);
