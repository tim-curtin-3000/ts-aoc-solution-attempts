type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F';
type Tile = Pipe | '.' | 'S';
type Direction = 'L' | 'R' | 'U' | 'D';

type Step = {
  location: number[];
  tile: Tile;
  from: Direction;
  to: Direction;
  getNextTile: TileGetter;
};

type TileGetter = (loc: number[]) => Step;

const getLoopStepsAndCounter = (input: string) => {
  const getTile = (x: number, y: number, d: Direction): Step => {
    const getNextTile = getNextTileToCheck(grid[x][y] as Pipe, d)!;
    const direction =
      getNextTile === getRight
        ? 'R'
        : getNextTile === getLeft
          ? 'L'
          : getNextTile === getTop
            ? 'U'
            : 'D';

    return {
      location: [x, y],
      tile: grid[x][y] as Tile,
      from: d,
      to: direction,
      getNextTile,
    };
  };

  const getTop = (currLoc: number[]) =>
    getTile(currLoc[0], currLoc[1] - 1, 'D');

  const getBottom = (currLoc: number[]) =>
    getTile(currLoc[0], currLoc[1] + 1, 'U');

  const getLeft = (currLoc: number[]) =>
    getTile(currLoc[0] - 1, currLoc[1], 'R');

  const getRight = (currLoc: number[]) =>
    getTile(currLoc[0] + 1, currLoc[1], 'L');

  const getAdjacentToStart = ([x, y]: number[]) => {
    const tileGetters: TileGetter[] = [];

    if (x !== 0) tileGetters.push(getLeft);
    if (x < gridWidth) tileGetters.push(getRight);
    if (y !== 0) tileGetters.push(getTop);
    if (y !== gridLength) tileGetters.push(getBottom);

    const nextTile = tileGetters
      .map((fn) => fn([x, y]))
      .filter(
        (t) =>
          t.tile !== '.' &&
          !!t.getNextTile &&
          !(t.location[0] === x - 1 && ['J', '|', '7'].includes(t.tile)) &&
          !(t.location[0] === x + 1 && ['F', '|', 'L'].includes(t.tile)) &&
          !(t.location[1] === y - 1 && ['J', '-', 'L'].includes(t.tile)) &&
          !(t.location[1] === y + 1 && ['F', '-', '7'].includes(t.tile)),
      )[0];

    return nextTile;
  };

  const getNextTileToCheck = (pipe: Pipe, comingFrom: Direction) => {
    switch (comingFrom) {
      case 'L': {
        if (pipe === '-') return getRight;
        if (pipe === 'J') return getTop;
        if (pipe === '7') return getBottom;
      }
      case 'R': {
        if (pipe === '-') return getLeft;
        if (pipe === 'L') return getTop;
        if (pipe === 'F') return getBottom;
      }
      case 'U': {
        if (pipe === '|') return getBottom;
        if (pipe === 'J') return getLeft;
        if (pipe === 'L') return getRight;
      }
      case 'D': {
        if (pipe === '|') return getTop;
        if (pipe === 'F') return getRight;
        if (pipe === '7') return getLeft;
      }
    }
  };

  const gridInput = input
    .trim()
    .split('\n')
    .map((line) => line.split(''));

  const gridLength = gridInput.length;
  const gridWidth = gridInput[0].length;
  const grid: string[][] = [];

  let startPos!: number[];

  for (let i = 0; i < gridLength; i++) {
    for (let j = 0; j < gridWidth; j++) {
      if (gridInput[i][j] === 'S') startPos = [j, i];
      if (!grid[j]) grid.push([]);
      grid[j].push(gridInput[i][j]);
    }
  }

  // Set up a steps array and add the first step
  const steps = [getAdjacentToStart(startPos)];

  // Set the current position as the location of the first step
  let currPos = steps[0].location;
  let counter = 0;

  while (currPos[0] !== startPos[0] || currPos[1] !== startPos[1]) {
    const prevStep = steps[counter];
    const nextStep = prevStep.getNextTile(prevStep.location);

    steps.push(nextStep);
    currPos = nextStep.location;
    counter++;
  }

  return { steps, counter };
};

export const expectedPartOneSampleOutput = '4';

export function solvePartOne(input: string): string {
  const { counter } = getLoopStepsAndCounter(input);
  return Math.ceil(counter / 2) + '';
}

export const expectedPartTwoSampleOutput = '4';

export function solvePartTwo(input: string): string {
  const { steps } = getLoopStepsAndCounter(input);
  const verticalDirections = ['U', 'D'];

  let accY = -1;
  let stepLocations = steps
    .sort((a, b) => a.location[1] - b.location[1])
    .reduce((acc, curr) => {
      if (curr.location[1] > accY) {
        acc.push([]);
        accY = curr.location[1];
      }
      acc[acc.length - 1].push(curr);

      return acc;
    }, [] as Step[][]);

  stepLocations.forEach((loopRow) =>
    loopRow.sort((a, b) => a.location[0] - b.location[0]),
  );

  // =============================================================================

  let enclosedArea = 0;
  let capturing: boolean;
  let prevVertDir: Step;

  stepLocations.forEach((row) => {
    capturing = true;

    row.forEach((tile, tileIdx) => {
      if (tileIdx === row.length - 1) return;

      const nextTile = row[tileIdx + 1];
      const currentX = tile.location[0];

      if (tileIdx === 0) prevVertDir = tile;

      const shouldToggle =
        (verticalDirections.includes(prevVertDir.from) &&
          verticalDirections.includes(tile.to) &&
          prevVertDir.from === tile.to) ||
        (verticalDirections.includes(prevVertDir.to) &&
          verticalDirections.includes(tile.from) &&
          prevVertDir.to === tile.from);

      if (shouldToggle) {
        capturing = !capturing;
        prevVertDir = tile;
      }

      const diff = nextTile.location[0] - currentX - 1;
      if (diff > 0 && capturing) enclosedArea += diff;
    });
  });

  return `${enclosedArea}`;
}
