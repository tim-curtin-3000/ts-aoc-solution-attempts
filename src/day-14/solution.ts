const getGrid = (input: string) =>
  input
    .trim()
    .split('\n')
    .map((line) => line.split(''));

const tiltNorth = (grid: string[][]) => {
  const gridLength = grid.length;
  const gridWidth = grid[0].length;

  // Probaby a more effecient way of doing these loops...
  for (let i = 0; i < gridLength; i++) {
    for (let j = 0; j < gridLength; j++) {
      for (let k = 0; k < gridWidth; k++) {
        if (j === gridLength - 1) break;
        const current = grid[j][k];
        const next = grid[j + 1][k];

        if (current === '.' && next === 'O') {
          grid[j][k] = next;
          grid[j + 1][k] = current;
        }
      }
    }
  }
};

const tiltSouth = (grid: string[][]) => {
  const gridLength = grid.length;
  const gridWidth = grid[0].length;

  for (let i = gridLength - 1; i > 0; i--) {
    for (let j = gridLength - 1; j > 0; j--) {
      for (let k = 0; k < gridWidth; k++) {
        const current = grid[j][k];
        const next = grid[j - 1][k];

        if (current === '.' && next === 'O') {
          grid[j][k] = next;
          grid[j - 1][k] = current;
        }
      }
    }
  }
};

const tiltEast = (grid: string[][]) => {
  const gridLength = grid.length;
  const gridWidth = grid[0].length;

  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridWidth; j++) {
      for (let k = 0; k < gridLength; k++) {
        if (j === gridWidth - 1) break;
        const current = grid[k][j];
        const next = grid[k][j + 1];

        if (current === 'O' && next === '.') {
          grid[k][j] = next;
          grid[k][j + 1] = current;
        }
      }
    }
  }
};

const tiltWest = (grid: string[][]) => {
  const gridLength = grid.length;
  const gridWidth = grid[0].length;

  for (let i = gridWidth - 1; i > 0; i--) {
    for (let j = gridWidth - 1; j > 0; j--) {
      for (let k = 0; k < gridLength; k++) {
        const current = grid[k][j];
        const next = grid[k][j - 1];

        if (current === 'O' && next === '.') {
          grid[k][j] = next;
          grid[k][j - 1] = current;
        }
      }
    }
  }
};

const getGridForRender = (grid: string[][]) =>
  grid.map((line) => line.join('')).join('\n');

const getNorthLoad = (grid: string[][]) =>
  grid
    .map((line) => line.join(''))
    .reduce(
      (total, line, lineIdx) =>
        (total += (line.match(/O/g) || []).length * (grid.length - lineIdx)),
      0,
    );

export const expectedPartOneSampleOutput = '136';

export function solvePartOne(input: string): string {
  const grid = getGrid(input);
  tiltNorth(grid);
  return `${getNorthLoad(grid)}`;
}

export const expectedPartTwoSampleOutput = '64';

export function solvePartTwo(input: string): string {
  const grid = getGrid(input);
  const loads: number[] = [];
  let counter = 0;

  let cycle: { length: number; offset: number } = { length: 0, offset: 0 };

  const noCycleDetected = () => {
    if (counter < 10) return true; // wait a few turns for the cycle to stabilise

    const tailNum = loads[loads.length - 1];
    for (let i = loads.length - 2; i > -1; i--) {
      const current = loads[i];

      if (current === tailNum) {
        cycle = { length: loads.length - i, offset: i };
        return false;
      }
    }

    return true;
  };

  do {
    tiltNorth(grid);
    tiltWest(grid);
    tiltSouth(grid);
    tiltEast(grid);

    loads.push(getNorthLoad(grid));
    counter++;
  } while (noCycleDetected());

  const idx = ((1000000000 - cycle.offset) % cycle.length) + cycle.offset - 1;
  return `${loads[idx]}`;
}
