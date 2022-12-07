import fs from 'fs';

type File = {
  size: number
}

type Dir = {
  parent: Dir | null
  dirs: Map<string, Dir>
  files: Map<string, File>
}

function changeDirectory(currDir: Dir, name: string): Dir {
  if (name === '/') {
    let dir = currDir;
    while (dir.parent !== null) dir = dir.parent;
    return dir;
  } else if (name === '..') {
    return currDir.parent!;
  } else {
    return currDir.dirs.get(name)!;
  }
}

function readFilesystem() {
  const rootDir = ({ parent: null, dirs: new Map(), files: new Map() });
  let currDir: Dir = rootDir;
  const input = fs.readFileSync('src/07/input.txt', 'utf8').split('\n').filter(line => line.trim().length > 0);
  input.forEach(line => {
      const parts = line.split(' ');
      if (parts[0] === '$') {
        if (parts[1] === 'cd') {
          currDir = changeDirectory(currDir, parts[2]);
        }
      } else {
        if (parts[0] === 'dir') {
          const [_, name] = parts;
          currDir.dirs.set(name, ({ parent: currDir, dirs: new Map(), files: new Map() }));
        } else {
          const [size, name] = parts;
          currDir.files.set(name, { size: Number(size) });
        }
      }
    },
  );
  return rootDir;
}

const rootDir = readFilesystem();

const dirSizes: number[] = [];

function getDirSize(dir: Dir): number {
  const dirsSize = Array.from(dir.dirs.values()).reduce((size, dir) => size + getDirSize(dir), 0);
  const filesSize = Array.from(dir.files.values()).reduce((size, file) => size + file.size, 0);
  const totalSize = dirsSize + filesSize;
  dirSizes.push(totalSize);
  return totalSize;
}

const rootDirSize = getDirSize(rootDir);
const sumSmallDirs = dirSizes.filter(s => s <= 100000).reduce((sum, size) => sum + size, 0);
console.log(`Part 1: ${sumSmallDirs}`);

const spaceRequired = 30000000 + rootDirSize - 70000000;
const smallestDir = dirSizes.reduce((smallest, size) => size > spaceRequired && size < smallest ? size : smallest, rootDirSize);
console.log(`Part 2: ${smallestDir}`);





