import fs from 'fs';

const input = fs.readFileSync('src/22/quadrant.txt', 'utf-8').split('\n')
const height = input.length
const width = input[0].length

let rotated = [...new Array(width)].map(() => new Array(height)) 

input.forEach((row, rowIndex) => row.split('').forEach((c, colIndex) => rotated[colIndex][height - rowIndex - 1] = c))

let output = ''
for(let row = 0; row < width; row ++){
    for (let col = 0; col < height; col ++){
        output += rotated[row][col]
    }
    output += '\n'
}
console.log(output)