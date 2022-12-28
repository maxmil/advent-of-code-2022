import fs from 'fs';
import * as util from "util";


enum Material {
  Ore = 1,
  Clay = 2,
  Obsidian = 3,
  Geode = 4,
}

type Price = {
  material: Material,
  quantity: number
}

type BluePrint = {
  robotPrices:Map<Material, Price[]>[]
}

const bluePrints = new Map(fs.readFileSync('src/19/input_test.txt', 'utf-8')
  .split('\n\n')
  .map((recipe, index) => {
    const robotPrices = new Map();
    recipe.split('\n').slice(1).map((line, index) => {
      const robotPrice = line.match(/\d+ [a-z]+/g)?.map(match => {
        const parts = match.split(' ')
        const quantity = Number(parts[0])
        const material = Material[["ore", "clay", "obsidean"].indexOf(parts[1]) + 1]
        return {material, quantity}
      })
      robotPrices.set(Material[index + 1], robotPrice)
    })
    return [index + 1, { robotPrices}]
  }));


  console.log(util.inspect(bluePrints, {depth: 4}))