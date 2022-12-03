import * as fs from "fs";

/*
* This solution uses array indexes to map weapons (rock, paper scissors) to numeric values and uses the fact that
*
*   mod3(weaponPlayer2 - weaponPlayer1) = result
*
* and
*
*   mod3(result + weaponPlayer1) = weaponPlayer2
*/

const playerOneMove = ['A', 'B', 'C'];
const playerTwoMove = ['X', 'Y', 'Z'];
const resultPoints = [3, 6, 0];
const resultColumn = ['Y', 'Z', 'X'];

const mod3 = (n: number) => ((n % 3) + 3) % 3;
const sum = (a: number[]) => a.reduce((sum, el) => sum + el, 0);

const cols = fs.readFileSync('src/02/input.txt', 'utf8').toString().split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.split(' '));

const scoresPart1 = cols.map(([move1, move2]) => {
    const weaponPlayerOne = playerOneMove.indexOf(move1) + 1;
    const weaponPlayerTwo = playerTwoMove.indexOf(move2) + 1;
    return weaponPlayerTwo + resultPoints[mod3(weaponPlayerTwo - weaponPlayerOne)];
});

console.log(`Part one: ${sum(scoresPart1)}`);

const scoresPart2 = cols.map(([move1, result]) => {
    const weaponPlayer1 = playerOneMove.indexOf(move1) + 1;
    const resultValue = resultColumn.indexOf(result);
    const weaponPlayer2 = mod3(resultValue + weaponPlayer1 - 1) + 1;
    return weaponPlayer2 + resultPoints[resultValue];
});

console.log(`Part two: ${sum(scoresPart2)}`);