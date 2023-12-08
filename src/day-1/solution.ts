export function solvePartOne(input: string): string {
  const processDigitString = (str: string) => {
    if (!str.trim()) return 0;

    const digits = str.replace(/\D/g, '');
    return +(digits[0] + digits[digits.length - 1]);
  };

  return (
    input
      .split('\n')
      .reduce((acc, curr) => (acc += processDigitString(curr)), 0) + ''
  );
}

export function solvePartTwo(input: string): string {
  const textToDigitMap: Record<string, string> = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
  };

  const processDigitString = (str: string, idx: number) => {
    if (!str.trim()) return 0;

    const digits = Array.from(
      str.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g),
    );

    const processMatch = (match: string) =>
      parseInt(match) ? match : textToDigitMap[match];

    return +(
      processMatch(digits[0][1]) + processMatch(digits[digits.length - 1][1])
    );
  };

  return (
    input
      .split('\n')
      .reduce((acc, curr, idx) => (acc += processDigitString(curr, idx)), 0) +
    ''
  );
}