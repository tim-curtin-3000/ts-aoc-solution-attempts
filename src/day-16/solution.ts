type Direction = 'L' | 'R' | 'U' | 'D';
type Tile = '.' | '|' | '-' | '/' | '\\';

type Step = { tile: Tile; direction: Direction; location: number[] };

const vDirs: Direction[] = ['U', 'D'];
const hDirs: Direction[] = ['L', 'R'];

const nonSplitterDirMap: Record<string, Direction> = {
  'D.': 'D',
  'U.': 'U',
  'L.': 'L',
  'R.': 'R',
  'D/': 'L',
  'U/': 'R',
  'L/': 'D',
  'R/': 'U',
  'D\\': 'R',
  'U\\': 'L',
  'L\\': 'U',
  'R\\': 'D',
};

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

const getGrid = (input: string) =>
  flipGrid(
    input
      .trim()
      .split('\n')
      .map((line) => line.split('')),
  );

const renderGrid = (grid: string[][]) => {
  console.log(grid.map((line) => line.join('')).join('\n'));
};

const getEnergisedTilesFromStart = (
  location: [number, number],
  direction: Direction,
  grid: string[][],
) => {
  const gridLength = grid.length - 1;
  const gridWidth = grid[0].length - 1;
  const uniqueVisits = new Set<string>();
  const uniqueStarts = new Set<string>();

  const branches: Step[] = [
    { tile: grid[location[0]][location[1]] as Tile, direction, location },
  ];

  while (branches.length) {
    let branchFinished = false;
    let currentStep: Step | null = branches.pop()!;

    const [startX, startY] = currentStep.location as number[];
    const startKey = `${currentStep.direction}[${startX},${startY}]`;

    if (uniqueStarts.has(startKey)) continue;
    uniqueStarts.add(startKey);

    while (!branchFinished) {
      if (!currentStep) {
        branchFinished = true;
        break;
      }

      let nextDirs: Direction[] = [];
      const { tile, direction } = currentStep;
      const [x, y] = currentStep.location as number[];

      uniqueVisits.add(`${x},${y}`);

      switch (tile) {
        case '.':
        case '/':
        case '\\': {
          nextDirs = [nonSplitterDirMap[`${direction}${tile}`]];
          break;
        }
        case '-': {
          nextDirs = hDirs.includes(direction) ? [direction] : hDirs;
          break;
        }
        case '|': {
          nextDirs = vDirs.includes(direction) ? [direction] : vDirs;
          break;
        }
      }

      const next = nextDirs.map((dir: Direction) => {
        const xPos = hDirs.includes(dir) ? (dir === 'L' ? x - 1 : x + 1) : x;
        const yPos = vDirs.includes(dir) ? (dir === 'U' ? y - 1 : y + 1) : y;
        if (xPos < 0 || xPos > gridWidth || yPos < 0 || yPos > gridLength) {
          return null;
        }

        return {
          location: [xPos, yPos],
          tile: grid[xPos][yPos] as Tile,
          direction: dir,
        };
      });

      currentStep = next[0];
      if (next[1]) branches.push(next[1]);
    }
  }

  return uniqueVisits.size;
};

export const expectedPartOneSampleOutput = '46';

export function solvePartOne(input: string): string {
  return `${getEnergisedTilesFromStart([0, 0], 'R', getGrid(input))}`;
}

export const expectedPartTwoSampleOutput = '51';

export function solvePartTwo(input: string): string {
  const grid = getGrid(input);
  const gridLength = grid.length - 1;
  const gridWidth = grid[0].length - 1;

  // Not very efficient but runs quickly enough...
  const configurationResults = [
    ...new Array(gridWidth)
      .fill(null)
      .map((_, i) => getEnergisedTilesFromStart([i, 0], 'D', grid)),
    ...new Array(gridWidth)
      .fill(null)
      .map((_, i) => getEnergisedTilesFromStart([i, gridLength], 'U', grid)),
    ...new Array(gridLength)
      .fill(null)
      .map((_, i) => getEnergisedTilesFromStart([0, i], 'R', grid)),
    ...new Array(gridLength)
      .fill(null)
      .map((_, i) => getEnergisedTilesFromStart([gridWidth, i], 'L', grid)),
  ];

  return `${Math.max(...configurationResults)}`;
}
