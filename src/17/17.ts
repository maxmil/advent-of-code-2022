import fs from 'fs';

type Rock = boolean[][];

const jets = fs.readFileSync('src/17/input.txt', 'utf-8')
  .split('')
  .map(c => c === '<' ? -1 : 1);

const rocks = fs.readFileSync('src/17/rocks.txt', 'utf-8')
  .split('\n\n')
  .map(lines => lines.split('\n')
    .map(line => {
      const cols = line.split('').map(c => c === '#');
      return [...new Array(7)].map((_, i) => i >= 2 && cols[i - 2]);
    }));

function dropRocks(rocksToDrop: number) {

  let chamber = [new Array(7).fill(true)];
  let blowCnt = 0;
  let fallen = 0;
  let rockIndex: number;
  let state: Map<string, { fallen: number, height: number }> = new Map();
  let towerH = 0;

  function insertRow() {
    chamber.unshift(new Array(7).fill(false));
  }

  function blowRock(rock: Rock, h: number): Rock {
    const direction = jets[blowCnt % jets.length];
    blowCnt++;
    if (direction === -1 && rock.find(cols => cols[0])) return rock;
    if (direction === 1 && rock.find(cols => cols[cols.length - 1])) return rock;

    let blownRock;
    if (direction === -1) blownRock = rock.map(cols => [...cols.slice(1), false]);
    else blownRock = rock.map(cols => [false, ...cols.slice(0, -1)]);

    const found = blownRock.find((cols, rowIndex) => cols.find((col, colIndex) => col && chamber[rowIndex + h][colIndex]));
    return found ? rock : blownRock;
  }

  function landRock(rock: Rock, h: number) {
    for (let row = 0; row < rock.length; row++) {
      chamber[h + row] = chamber[h + row].map((col, index) => col!! || rock[row][index]);
    }
  }

  function rockLanded(rock: Rock, h: number) {
    for (let rockRow = rock.length - 1; rockRow >= 0; rockRow--) {
      const rockCols = rock[rockRow];
      const chamberCols = chamber[h + rockRow];
      if (chamberCols.find((chamberCol, index) => chamberCol && rockCols[index])) {
        landRock(rock, h - 1);
        return true;
      }
    }
    return false;
  }

  function dropRock(initialRock: Rock) {
    let h = 0;
    let rock = initialRock;
    do {
      rock = blowRock(rock, h);
      h++;
    } while (!rockLanded(rock, h));
  }

  function emptyRows() {
    let cnt = 0;
    while (chamber.length > cnt && !chamber[cnt].find(col => col)) cnt++;
    return cnt;
  }

  function drawChamber(fromRow = 0, toRow = chamber.length) {
    console.log(chamber
      .filter((_, index) => index >= fromRow && index <= toRow)
      .map(cols => cols.map(c => c ? '#' : '.').join('')).join('\n'),
    );
  }

  function removeEmptyRows() {
    chamber.splice(0, emptyRows());
  }


  function serialize() {
    return `${rockIndex},${blowCnt % jets.length},${firstRockInColumn().join()}`;
  }

  function firstRockInColumn(): number[] {
    const result = new Array(7);
    let found = 0;
    let row = 0;
    while (true) {
      for (let col = 0; col < 7; col++) {
        if (result[col] === undefined && chamber[row][col]) {
          result[col] = row;
          found++;
          if (found === 7) return result;
        }
      }
      row++;
    }
  }

  let cycleDetected = false;
  for (; fallen < rocksToDrop; fallen++) {
    rockIndex = fallen % rocks.length;
    const rock = rocks[rockIndex];
    for (let row = 0; row < 3 + rock.length; row++) insertRow();
    dropRock(rock);
    removeEmptyRows();

    if (!cycleDetected) {
      const serializedState = serialize();
      const cycleStart = state.get(serializedState);
      if (cycleStart !== undefined) {
        const rocksInCycle = fallen - cycleStart.fallen;
        const remainingCycles = Math.floor((rocksToDrop - fallen) / rocksInCycle);
        fallen = fallen + remainingCycles * rocksInCycle;
        const heightOfRemainingCycles = (chamber.length - cycleStart.height) * remainingCycles;
        const keepRows = firstRockInColumn().reduce((max, h) => Math.max(max, h), 0);
        const removedRows = chamber.splice(keepRows + 1).length;
        towerH = heightOfRemainingCycles + removedRows;
        cycleDetected = true;
        continue;
      }
      state.set(serializedState, { fallen, height: chamber.length });
    }
  }
  return towerH + chamber.length - 1;
}

console.log(`Part 1: ${dropRocks(2022)}`);
console.log(`Part 2: ${dropRocks(1000000000000)}`);
