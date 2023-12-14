const flipGrid = (origGrid: string[][]) => {
  let gridLength = origGrid.length;
  let gridWidth = origGrid[0].length;
  let grid: string[][] = [];

  for (let i = 0; i < gridLength; i++) {
    for (let j = 0; j < gridWidth; j++) {
      if (!grid[j]) grid.push([]);
      grid[j].push(origGrid[i][j]);
    }
  }
  return grid;
};

const getEmptyLineIndexes = (gridlines: string[]) =>
  gridlines.reduce(
    (acc, line, idx) => (/^([.])\1*$/.test(line) ? [...acc, idx] : acc),
    [] as number[],
  );

const getGalaxies = (grid: string[][]) => {
  const gridWidth = grid[0].length;
  const galaxies: number[][] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < gridWidth; j++) {
      let region = grid[i][j];
      if (region !== '.') galaxies.push([j, i]);
    }
  }

  return galaxies;
};

const getGalaxyPathLengths = (input: string, distanceFactor: number) => {
  const gridLines = input.trim().split('\n');
  const grid = flipGrid(gridLines.map((line) => line.split('')));
  const galaxies = getGalaxies(grid);

  // Get empty row and cols and store them.
  const expandedCols = getEmptyLineIndexes(gridLines);
  const expandedRows = getEmptyLineIndexes(grid.map((x) => x.join('')));

  let allPathLengths = 0;

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = galaxies.length - 1; j >= 0; j--) {
      const [x1, y1] = galaxies[i];
      const [x2, y2] = galaxies[j];

      if (x1 === x2 && y1 === y2) break;

      const startX = Math.min(x1, x2);
      const endX = Math.max(x1, x2);
      const startY = Math.min(y1, y2);
      const endY = Math.max(y1, y2);

      const cols = expandedCols.filter((col) => col > startX && col < endX);
      const rows = expandedRows.filter((row) => row > startY && row < endY);
      const xDist = endX - startX - cols.length + cols.length * distanceFactor;
      const yDist = endY - startY - rows.length + rows.length * distanceFactor;

      allPathLengths += xDist + yDist;
    }
  }

  return allPathLengths + '';
};

export const expectedPartOneSampleOutput = '374';

export function solvePartOne(input: string): string {
  return getGalaxyPathLengths(input, 2);
}

export const expectedPartTwoSampleOutput = '';

export function solvePartTwo(input: string): string {
  return getGalaxyPathLengths(input, 1000000);
}
