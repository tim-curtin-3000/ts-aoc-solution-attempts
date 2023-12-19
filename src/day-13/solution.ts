const getGroupsFromInput = (input: string) =>
  input
    .trim()
    .split('\n\n')
    .map((group) => group.split('\n'));

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

const getReflectionIdx = (group: string[]) => {
  return group.reduce(
    (acc, line, idx) =>
      line === group[idx - 1] && checkReflective(group, idx) ? idx : acc,
    -1,
  );
};

const checkReflective = (group: string[], idx: number): boolean => {
  const half = Math.min(group.length - idx, idx);
  const section = group.slice(idx - half, idx + half);

  for (let i = 0; i < section.length / 2; i++) {
    if (section[i] !== section[section.length - 1 - i]) return false;
  }
  return true;
};

const checkLineDiffs = (lineA: string, lineB: string) => {
  const lineDiffs: number[] = [];

  for (let i = 0; i < lineA.length; i++) {
    if (lineA[i] !== lineB[i]) lineDiffs.push(i);
  }
  return lineDiffs;
};

const checkSmudgedPatterns = (group: string[]) => {
  const consecutiveLineSmudges: number[][] = [];
  let reflectionIdx = -1;

  // Check for possible updated reflection index
  for (let i = 0; i < group.length; i++) {
    if (i === 0) continue;

    const curr = group[i];
    const prev = group[i - 1];
    const lineDiffs = checkLineDiffs(curr, prev);

    if (lineDiffs.length === 1) {
      consecutiveLineSmudges.push([i, lineDiffs[0]]);
    }
  }

  // If there's a smudge in this direction fix it and test if reflective
  for (let i = 0; i < consecutiveLineSmudges.length; i++) {
    const [lineIdx, smudgeIdx] = consecutiveLineSmudges[i];
    const line = group[lineIdx];
    const smudge = line[smudgeIdx];
    const testGroup = group.slice();

    testGroup[lineIdx] = `${line.slice(0, smudgeIdx)}${
      smudge === '.' ? '#' : '.'
    }${line.slice(smudgeIdx + 1)}`;

    let test = checkReflective(testGroup, lineIdx);

    // At this point a smudge fix resulted in a line of reflection
    if (test) {
      reflectionIdx = lineIdx;
      break;
    }
  }

  if (reflectionIdx === -1) {
    group.forEach((line, idx) => {
      // Look for an existing point of reflection
      if (line === group[idx - 1]) {
        const half = Math.min(group.length - idx, idx);
        const section = group.slice(idx - half, idx + half);
        const lineDiffs: number[][] = [];

        for (let j = 0; j < section.length / 2; j++) {
          const curr = section[j];
          const prev = section[section.length - 1 - j];
          const currDiffs = checkLineDiffs(curr, prev);

          if (currDiffs.length > 0) lineDiffs.push(currDiffs);
          if (currDiffs.length > 1) break;
        }

        if (lineDiffs.length === 1 && lineDiffs[0].length === 1) {
          reflectionIdx = idx;
        }
      }
    });
  }
  return reflectionIdx;
};

// =============================================================================

// =============================================================================

export const expectedPartOneSampleOutput = '405';

export function solvePartOne(input: string): string {
  const groups = getGroupsFromInput(input);

  const horizReflections = groups.reduce((total, group, groupIdx) => {
    const reflectionIdx = getReflectionIdx(group);
    return (total += reflectionIdx > -1 ? reflectionIdx * 100 : 0);
  }, 0);

  const vertReflections = groups.reduce((total, group) => {
    const flipped = flipGrid(group.map((line) => line.split(''))).map((line) =>
      line.join(''),
    );

    const reflectionIdx = getReflectionIdx(flipped);
    return (total += reflectionIdx > -1 ? reflectionIdx : 0);
  }, 0);

  return `${vertReflections + horizReflections}`;
}

export const expectedPartTwoSampleOutput = '400';

export function solvePartTwo(input: string): string {
  const groups = getGroupsFromInput(input);

  const horizReflections = groups.reduce((total, group, idx) => {
    const reflectionIdx = checkSmudgedPatterns(group);
    total += reflectionIdx > -1 ? reflectionIdx * 100 : 0;
    return total;
  }, 0);

  const vertReflections = groups.reduce((total, group, idx) => {
    const flipped = flipGrid(group.map((line) => line.split(''))).map((line) =>
      line.join(''),
    );

    const reflectionIdx = checkSmudgedPatterns(flipped);
    return (total += reflectionIdx > -1 ? reflectionIdx : 0);
  }, 0);

  return `${horizReflections + vertReflections}`;
}
