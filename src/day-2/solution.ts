import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleInput = fs.readFileSync(
  path.resolve(__dirname, 'input-sample-part-1.txt'),
  'utf8',
);

const textInput = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf8');

const cubeAmountLimits: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const generateGameMap = (input: string) => {
  return input
    .trim()
    .split('\n')
    .reduce(
      (acc, curr) => {
        let [a, b] = curr.split(':');

        const gameNo = a.split(' ')[1];
        const gameSets = b
          .replace(/;/g, ',')
          .split(',')
          .map((set) => set.trim().split(' '));

        acc[gameNo] = gameSets;
        return acc;
      },
      {} as Record<string, string[][]>,
    );
};

const gamePredicate = (input: string[][]): boolean =>
  !input.some(([number, color]) => +number > cubeAmountLimits[color]);

/* SOLUTIONS */

export function solvePartOne(input: string): string {
  const gameMap = generateGameMap(input);

  return (
    Object.entries(gameMap).reduce(
      (acc, [gameNo, games]) => (acc += gamePredicate(games) ? +gameNo : 0),
      0,
    ) + ''
  );
}

const colorToTripleIndex: Record<string, number> = {
  red: 0,
  green: 1,
  blue: 2,
};

export function solvePartTwo(input: string): number {
  const inputLines = input.trim().split('\n');

  const setPowers = inputLines.reduce((acc, curr) => {
    const gameSets = curr
      .split(':')[1]
      .replace(/;/g, ',')
      .split(',')
      .map((set) => set.trim().split(' '));

    const powers = gameSets
      .reduce(
        (acc, [amount, color]) => {
          const idx = colorToTripleIndex[color];
          if (+amount >= acc[idx]) acc[idx] = +amount;
          return acc;
        },
        new Array(3).fill(0) as number[],
      )
      .reduce((a, b) => a * b, 1);

    return [...acc, powers];
  }, [] as number[]);

  return setPowers.reduce((a, b) => a + b, 0);
}

// console.log(solvePartOne(sampleInput));
// console.log(solvePartOne(textInput));

// console.log(solvePartTwo(sampleInput));
// console.log(solvePartOne(textInput));
