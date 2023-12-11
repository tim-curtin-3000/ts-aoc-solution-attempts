const getSeedsAndMapInputs = (input: string) =>
  input
    .trim()
    .replace(/\n\n/g, '|')
    .split('|')
    .map((line) => line.split(':')[1].trim());

const mapSourceToDest = (source: number, mapInput: string) => {
  const map = mapInput
    .split('\n')
    .map((triple) => triple.split(' ').map((n) => +n));

  let mapped = source;

  const sourceMatch = map.find((x) => source >= x[1] && source <= x[1] + x[2]);

  if (sourceMatch) {
    const offset = sourceMatch[1] + sourceMatch[2] - source;
    mapped = sourceMatch[0] + sourceMatch[2] - offset;
  }

  return mapped;
};

const mapMinMaxSourcesToDest = (inputs: number[][], mapInput: string) => {
  const map = mapInput
    .split('\n')
    .map((triple) => triple.split(' ').map((n) => +n));

  return inputs.reduce((acc, [min, max]) => {
    const mapHits = map.reduce((hits, [mDest, mapSourceMin, mOffset]) => {
      const mapSourceMax = mapSourceMin + mOffset;
      const minSourceInRange = min >= mapSourceMin && min <= mapSourceMax;
      const maxSourceInRange = max >= mapSourceMin && max <= mapSourceMax;

      // Fully Matched
      if (minSourceInRange && maxSourceInRange) {
        const minHit = mDest + mOffset - (mapSourceMax - min);
        const maxHit = mDest + mOffset - (mapSourceMax - max);
        return [...hits, [minHit, maxHit]];
      }
      // Partially Matched
      if (minSourceInRange && !maxSourceInRange) {
        const minHit = mDest + mOffset - (mapSourceMax - min);
        const maxHit = mDest + mOffset;
        return [...hits, [minHit, maxHit]];
      }
      // Partially Matched
      if (!minSourceInRange && maxSourceInRange) {
        const minHit = mDest;
        const maxHit = mDest + mOffset - (mapSourceMax - max);
        return [...hits, [minHit, maxHit]];
      }

      return hits;
    }, [] as number[][]);

    if (!mapHits.length) return [[min, max]];
    return [...acc, ...mapHits];
  }, [] as number[][]);
};

export const expectedPartOneSampleOutput = '35';

export function solvePartOne(input: string): string {
  const [seeds, ...mapInputs] = getSeedsAndMapInputs(input);
  let sources = seeds.split(' ').map((s) => +s);

  for (let mapInput of mapInputs) {
    sources = sources.map((source) => mapSourceToDest(source, mapInput));
  }

  return Math.min(...sources) + '';
}

export const expectedPartTwoSampleOutput = '46';

export function solvePartTwo(input: string): string {
  let [seeds, ...mapInputs] = getSeedsAndMapInputs(input);

  let sources = seeds.split(' ').reduce((a, c, i) => {
    if (i % 2 === 0) a.push([+c]);
    else a[a.length - 1].push(+c);
    return a;
  }, [] as number[][]);

  let results: number[][] = [];

  for (let tuple of sources) {
    const [min, offset] = tuple;
    /* set the initial seed values to the min and max of the tuple */
    let mapResults = [[min, min + offset - 1]];

    /* cycle through the maps and update the result */
    for (let i = 0; i < mapInputs.length; i++) {
      mapResults = mapMinMaxSourcesToDest(mapResults, mapInputs[i]); //
    }
    results.push(...mapResults);
  }

  return Math.min(...results.map((tuple) => tuple[0])) + '';
}
