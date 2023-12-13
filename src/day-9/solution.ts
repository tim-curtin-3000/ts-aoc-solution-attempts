const getFormattedInput = (input: string) => {
  return input
    .trim()
    .split('\n')
    .map((line) => line.split(' ').map((n) => +n));
};

const getInitialReducedSeqs = (origSeq: number[]) => {
  let reducedSeqs = [origSeq];

  for (let i = 0; i < origSeq.length; i++) {
    const prevSeq = reducedSeqs[i];

    const currSeq = prevSeq.reduce((acc, curr, idx) => {
      if (idx === prevSeq.length - 1) return acc;
      return [...acc, prevSeq[idx + 1] - curr];
    }, [] as number[]);

    reducedSeqs.push(currSeq);
    if (currSeq.every((n) => n === 0)) break;
  }

  return reducedSeqs;
};

const extrapolateForwards = (sequence: number[]): number => {
  let reducedSeqs = getInitialReducedSeqs(sequence);

  for (let i = reducedSeqs.length - 1; i >= 0; i--) {
    const currSeq = reducedSeqs[i];

    if (i === reducedSeqs.length - 1) currSeq.push(0);
    else {
      const prevSeq = reducedSeqs[i + 1];
      const nextNum = currSeq[currSeq.length - 1] + prevSeq[prevSeq.length - 1];
      currSeq.push(nextNum);
    }
  }

  const origSeqExtrapolated = reducedSeqs[0];
  return origSeqExtrapolated[origSeqExtrapolated.length - 1];
};

const extrapolateBackwards = (sequence: number[]): number => {
  let reducedSeqs = getInitialReducedSeqs(sequence);

  for (let i = reducedSeqs.length - 1; i >= 0; i--) {
    const currSeq = reducedSeqs[i];

    if (i === reducedSeqs.length - 1) currSeq.unshift(0);
    else {
      const prevSeq = reducedSeqs[i + 1];
      const nextNum = currSeq[0] - prevSeq[0];
      currSeq.unshift(nextNum);
    }
  }

  const origSeqExtrapolated = reducedSeqs[0];
  return origSeqExtrapolated[0];
};

export const expectedPartOneSampleOutput = '114';

export function solvePartOne(i: string): string {
  return (
    getFormattedInput(i).reduce((t, c) => (t += extrapolateForwards(c)), 0) + ''
  );
}

export const expectedPartTwoSampleOutput = '2';

export function solvePartTwo(i: string): string {
  return (
    getFormattedInput(i).reduce((t, c) => (t += extrapolateBackwards(c)), 0) +
    ''
  );
}
