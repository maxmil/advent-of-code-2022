import { time } from 'console';
import fs from 'fs';
import { maxHeaderSize } from 'http';
import * as util from 'util';

enum Material {
  Ore = 1,
  Clay = 2,
  Obsidian = 3,
  Geode = 4,
}

type Price = {
  material: Material;
  quantity: number;
};

type BluePrint = {
  robotPrices: Map<Material, Price[]>;
  maxPrices: MaterialMap;
};

class MaterialMap extends Map<Material, number> {
  getOrDefault(material: Material, defaultValue = 0) {
    return this.get(material) ?? defaultValue;
  }
}

function collectResources(minutes: number, maxPrices: MaterialMap, robots: MaterialMap, resources: MaterialMap) {
  // console.log('before', util.inspect(resources, { depth: 2 }));
  const collected = new MaterialMap(
    Array.from(robots.entries()).map(([material, quantity]) => {
      const total = resources.getOrDefault(material) + quantity;
      const spendable = maxPrices.getOrDefault(material) * (minutes + 1) - quantity * (minutes - 1);
      // console.log(material, util.inspect(resources, { depth: 2 }), resources.getOrDefault(material), Math.min(total, spendable) )
      // process.exit()
      return [material, Math.min(total, spendable)];
    }),
  );
  // console.log('after ', util.inspect(collected, { depth: 2 }));
  return collected;
}

function maxGeodes(bluePrint: BluePrint, minutes: number, visited: Map<string, number>, robots: MaterialMap, resources: MaterialMap): number {
  if (minutes === 0) {
    // if (collected.get(Material.Geode) === 9) {
    //   console.log(history.join('\n'))
    //   console.log("")
    // }
    const geodes = resources.getOrDefault(Material.Geode);
    // if (geodes > maxFound) console.log(geodes)
    maxFound = Math.max(maxFound, geodes);
    return geodes;
  }

  const key = `${minutes}|${Array.from(robots.values()).join(',')}|${Array.from(resources.values()).join(',')}`;
  if (visited.has(key)) return visited.get(key)!;

  const collected = collectResources(minutes, bluePrint.maxPrices, robots, resources);

  const possibleGeodes = (collected.get(Material.Geode) ?? 0) + (robots.get(Material.Geode) ?? 0) * minutes + (minutes * (minutes + 1)) / 2;
  if (possibleGeodes < maxFound) {
    // console.log('early return')
    return 0;
  }

  const geodes = [Material.Geode, Material.Obsidian, Material.Clay, Material.Ore, null]
    .filter(
      (material) =>
        material === null || bluePrint.robotPrices.get(material)!.find((price) => (resources.get(price.material) ?? 0) < price.quantity) === undefined,
    )
    .filter((material) => material === null || (robots.get(material) ?? 0) < bluePrint.maxPrices.get(material)!)
    .map((material) => {
      if (material === null) return maxGeodes(bluePrint, minutes - 1, visited, robots, collected);
      const prices = bluePrint.robotPrices.get(material)!;
      const robotsAfterBuying = new MaterialMap(robots);
      robotsAfterBuying.set(material, (robots.get(material) ?? 0) + 1);
      const resourcesAfterBuying = new MaterialMap(collected);
      prices.forEach((price) => resourcesAfterBuying.set(price.material, resourcesAfterBuying.get(price.material)! - price.quantity));
      return maxGeodes(bluePrint, minutes - 1, visited, robotsAfterBuying, resourcesAfterBuying);
    })
    .reduce((max, geodes) => Math.max(max, geodes), 0);

  visited.set(key, geodes);
  return geodes;
}

const bluePrints = fs
  .readFileSync('src/19/input.txt', 'utf-8')
  .split('\n')
  .map((recipe) => {
    const robotPrices = new Map<Material, Price[]>();
    const maxPrices = new MaterialMap([[Material.Geode, Number.POSITIVE_INFINITY]]);
    recipe
      .split('.')
      .slice(0, -1)
      .map((line, index) => {
        const robotPrice = line.match(/\d+ [a-z]+/g)!.map((match) => {
          const parts = match.split(' ');
          const quantity = Number(parts[0]);
          const material = ['ore', 'clay', 'obsidian'].indexOf(parts[1]) + 1;
          maxPrices.set(material, Math.max(maxPrices.get(material) ?? 0, quantity));
          return { material, quantity };
        });
        robotPrices.set(index + 1, robotPrice);
      });
    return { robotPrices, maxPrices };
  });

let maxFound = 0;

const qualityLevelSum = bluePrints
  .map((bluePrint, index) => {
    maxFound = 0;
    const geodes = maxGeodes(bluePrint, 24, new Map(), new MaterialMap([[Material.Ore, 1]]), new MaterialMap());
    console.log(index + 1, geodes);
    return geodes;
  })
  .reduce((sum, maxGeodes, index) => sum + maxGeodes * (index + 1), 0);

console.log(`Part 1: ${qualityLevelSum}`);

const geodeProductFirstThree = bluePrints
  .slice(0, 3)
  .map((bluePrint, index) => {
    maxFound = 0;
    const geodes = maxGeodes(bluePrint, 32, new Map(), new MaterialMap([[Material.Ore, 1]]), new MaterialMap());
    console.log(index + 1, geodes);
    return geodes;
  })
  .reduce((product, maxGeodes) => product * maxGeodes, 1);

console.log(`Part 2: ${geodeProductFirstThree}`);
