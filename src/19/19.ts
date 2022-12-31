import fs from 'fs';

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
  getOrDefault(material: Material, defaultValue = 0): number {
    return this.get(material) ?? defaultValue;
  }

  with(material: Material, quantity: number) {
    const newMaterialMap = new MaterialMap(this);
    newMaterialMap.set(material, this.getOrDefault(material) + quantity);
    return newMaterialMap;
  }
}

function findMaxGeodes(bluePrint: BluePrint, minutes: number): number {
  function maxGeodes(bluePrint: BluePrint, minutes: number, visited: Map<string, number>, robots: MaterialMap, resources: MaterialMap): number {
    if (minutes === 0) {
      const geodes = resources.getOrDefault(Material.Geode);
      maxFound = Math.max(maxFound, geodes);
      return geodes;
    }

    const key = `${minutes}|${Array.from(robots.values()).join(',')}|${Array.from(resources.values()).join(',')}`;
    if (visited.has(key)) return visited.get(key)!;

    const collected = new MaterialMap(
      Array.from(robots.entries()).map(([material, collected]) => {
        const total = resources.getOrDefault(material) + collected;
        const spendable = bluePrint.maxPrices.getOrDefault(material) * (minutes + 1) - collected * (minutes - 1);
        return [material, Math.min(total, spendable)];
      }),
    );

    const possibleGeodes = (collected.get(Material.Geode) ?? 0) + (robots.get(Material.Geode) ?? 0) * minutes + (minutes * (minutes + 1)) / 2;
    if (possibleGeodes < maxFound) return 0;

    const geodes = [Material.Geode, Material.Obsidian, Material.Clay, Material.Ore, null]
      .filter(
        (material) =>
          material === null || bluePrint.robotPrices.get(material)!.find((price) => resources.getOrDefault(price.material) < price.quantity) === undefined,
      )
      .filter((material) => material === null || (robots.get(material) ?? 0) < bluePrint.maxPrices.get(material)!)
      .map((material) => {
        if (material === null) return maxGeodes(bluePrint, minutes - 1, visited, robots, collected);
        const prices = bluePrint.robotPrices.get(material)!;
        const resourcesAfterBuying = prices.reduce((resources, price) => resources.with(price.material, -price.quantity), new MaterialMap(collected));
        return maxGeodes(bluePrint, minutes - 1, visited, robots.with(material, 1), resourcesAfterBuying);
      })
      .reduce((max, geodes) => Math.max(max, geodes), 0);

    visited.set(key, geodes);
    return geodes;
  }

  let maxFound = 0;
  return maxGeodes(bluePrint, minutes, new Map(), new MaterialMap([[Material.Ore, 1]]), new MaterialMap());
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

const qualityLevelSum = bluePrints.map((bluePrint) => findMaxGeodes(bluePrint, 24)).reduce((sum, maxGeodes, index) => sum + maxGeodes * (index + 1), 0);

console.log(`Part 1: ${qualityLevelSum}`);

const geodeProductFirstThree = bluePrints
  .slice(0, 3)
  .map((bluePrint) => findMaxGeodes(bluePrint, 32))
  .reduce((product, maxGeodes) => product * maxGeodes, 1);

console.log(`Part 2: ${geodeProductFirstThree}`);
