export const expectedPartOneSampleOutput = '1320';

const hash = (chars: string) => {
  return chars
    .split('')
    .reduce((hash, char) => ((hash + char.charCodeAt(0)) * 17) % 256, 0);
};

export function solvePartOne(input: string): string {
  return `${input
    .trim()
    .split(',')
    .reduce((total, curr) => (total += hash(curr)), 0)}`;
}

export const expectedPartTwoSampleOutput = '145';

export function solvePartTwo(input: string): string {
  const boxes: Record<string, string[][]> = new Array(256)
    .fill(null)
    .reduce((acc, _, idx) => ({ ...acc, [idx]: [] }), {});

  const steps = input.trim().split(',');

  for (let step of steps) {
    const operation = step.includes('=') ? '=' : '-';
    const [label, focalLength] = step.split(operation);
    const record = [label, focalLength];
    const boxNo = hash(label);
    const box = boxes[boxNo];

    if (operation === '=') {
      const found = box.findIndex((r: string[]) => r[0] === label);

      if (found === -1) box.push(record);
      else box[found] = record;
    } else {
      boxes[boxNo] = box.filter((r: string[]) => r[0] !== label);
    }
  }

  let total = 0;
  for (let [boxIdx, box] of Object.entries(boxes)) {
    for (let [lensIdx, lens] of box.entries()) {
      total += (+boxIdx + 1) * (lensIdx + 1) * +lens[1];
    }
  }

  return `${total}`;
}
