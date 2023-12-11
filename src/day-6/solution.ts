export const expectedPartOneSampleOutput = '288';

const getWinningCombos = (raceInfo: number[]): number => {
  const [raceTime, distance] = raceInfo;
  const trials = new Array(raceTime)
    .fill(null)
    .map((_, idx) => idx + 1)
    .filter((t) => (raceTime - t) * t > distance);

  return trials.length;
};

export function solvePartOne(input: string): string {
  const [times, distances] = input
    .trim()
    .split('\n')
    .map((line) => line.split(':')[1].trim())
    .map((x) => x.split(/\s+/));

  const raceTuples = times.map((time, idx) => [+time, +distances[idx]]);

  return (
    raceTuples.reduce((total, tuple) => (total *= getWinningCombos(tuple)), 1) +
    ''
  );
}

export const expectedPartTwoSampleOutput = '71503';

export function solvePartTwo(input: string): string {
  const [time, distance] = input
    .trim()
    .split('\n')
    .map((line) => line.split(':')[1].trim())
    .map((x) => +x.replace(/\s+/g, ''));

  // I'm sure there's an optimal solution for this - you probably got it R ;)
  // I'll have to circle back when there's more time (currently runs at ~4100ms for me)

  const trials = new Array(time)
    .fill(null)
    .map((_, idx) => idx + 1)
    .filter((t) => (time - t) * t > distance);

  return trials.length + '';
}
