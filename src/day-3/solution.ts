export const expectedPartOneSampleOutput = '4361';

export function solvePartOne(input: string): string {
  const inputArr = input
    .trim()
    .replace(/[^\d\n.]/g, '*')
    .split('\n');

  const getPartTotalsForLine = (line: string, lineIdx: number): number => {
    const linesToCheck = ([] as string[])
      .concat(inputArr[lineIdx - 1] || [])
      .concat(line)
      .concat(inputArr[lineIdx + 1] || []);

    const partMatches = Array.from(line.matchAll(/(\d+)/g)).map((match) => {
      const partNum = match[0];
      const idx = match['index'] as number;

      const startIdx = idx === 0 ? 0 : idx - 1;
      const endIdx = idx + partNum.length + 1;

      return linesToCheck.some((line) =>
        line.substring(startIdx, endIdx).includes('*'),
      )
        ? +partNum
        : 0;
    });

    return partMatches.reduce((a, b) => a + b, 0);
  };

  return (
    inputArr.reduce((a, c, i) => (a += getPartTotalsForLine(c, i)), 0) + ''
  );
}

type Part = { pNum: string; startIdx: number; endIdx: number };
type StarLoc = { line: number; index: number };

export const expectedPartTwoSampleOutput = '467835';

export function solvePartTwo(input: string): string {
  /* Get some information on parts and stars and save in data-structure */
  const { parts, stars } = input
    .trim()
    .replace(/[^\d\n.*]/g, '.')
    .split('\n')
    .reduce(
      (acc, line, lineIdx) => {
        const parts = [] as Part[];
        const stars = [] as StarLoc[];

        Array.from(line.matchAll(/(\d+)|\*/g)).forEach((match) => {
          const m = match[0];
          const idx = match['index'] as number;

          if (m === '*') stars.push({ line: lineIdx, index: idx });
          else {
            parts.push({
              pNum: m,
              startIdx: idx,
              endIdx: idx + m.length - 1,
            });
          }
        });

        acc.parts[lineIdx] = parts;
        if (stars.length) acc.stars.push(...stars);

        return acc;
      },
      {
        parts: {} as Record<number, Part[]>,
        stars: [] as StarLoc[],
      },
    );

  const checkPartIndexes = (part: Part, starStart: number, starEnd: number) => {
    const { startIdx, endIdx } = part;
    return (
      (startIdx <= starEnd && startIdx >= starStart) ||
      (endIdx >= starStart && endIdx <= starEnd)
    );
  };

  const result = stars.reduce((acc, star) => {
    const starStart = star.index === 0 ? 0 : star.index - 1;
    const starEnd = star.index + 1;

    const partNumsToCheck = ([] as Part[])
      .concat(parts[star.line - 1] || [])
      .concat(parts[star.line])
      .concat(parts[star.line + 1] || []);

    const hits = partNumsToCheck.filter((partNum) =>
      checkPartIndexes(partNum, starStart, starEnd),
    );

    if (hits.length === 2) acc += +hits[0].pNum * +hits[1].pNum;

    return acc;
  }, 0);

  return result + '';
}
