export const expectedPartOneSampleOutput = '2';

export function solvePartOne(input: string): string {
  const [patternInput, ...nodesInput] = input.trim().split(/\n+/g);
  const pattern = patternInput.split('').map((dir) => (dir === 'L' ? 0 : 1));

  const nodes = nodesInput.reduce(
    (map, curr) => {
      const [key, nodeParts] = curr.replace(/\s+|[()]/g, '').split('=');
      return { ...map, [key]: nodeParts.split(',') };
    },
    {} as Record<string, string[]>,
  );

  let currentPos = 'AAA';
  let counter = 0;
  let patternIdx = 0;

  while (currentPos !== 'ZZZ') {
    currentPos = nodes[currentPos][pattern[patternIdx]];
    patternIdx = patternIdx === pattern.length - 1 ? 0 : patternIdx + 1;
    counter++;
  }

  return counter + '';
}

const gcd = (...numbers: number[]): number => {
  return numbers.reduce((a, b) => (b === 0 ? a : gcd(b, a % b)));
};

const lcm = (numbers: number[]): number => {
  return numbers.reduce((a, b) => Math.abs(a * b) / gcd(a, b));
};

export const expectedPartTwoSampleOutput = '6';

export function solvePartTwo(input: string): string {
  const [patternInput, ...nodesInput] = input.trim().split(/\n+/g);
  const pattern = patternInput.split('').map((dir) => (dir === 'L' ? 0 : 1));

  const nodes = nodesInput.reduce(
    (map, curr) => {
      const [key, nodeParts] = curr.replace(/\s+|[()]/g, '').split('=');
      return { ...map, [key]: nodeParts.split(',') };
    },
    {} as Record<string, string[]>,
  );

  const getCountFromStartingPos = (pos: string) => {
    let counter = 0;
    let patternIdx = 0;

    while (!pos.endsWith('Z')) {
      pos = nodes[pos][pattern[patternIdx]];
      patternIdx = patternIdx === pattern.length - 1 ? 0 : patternIdx + 1;
      counter++;
    }

    return counter;
  };

  let allRunsCounters = Object.keys(nodes).filter((node) =>
    node.endsWith('A'),
  ).map((pos) => getCountFromStartingPos(pos));

  return lcm(allRunsCounters) + '';
}
