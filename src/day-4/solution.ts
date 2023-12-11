export const expectedPartOneSampleOutput = '13';

export function solvePartOne(input: string): string {
  return (
    input
      .trim()
      .split('\n')
      .map((cards) => cards.split(/[:|]/))
      .reduce((acc, card) => {
        const winNums = new Set(card[1].trim().split(/\s+/));
        const winners = card[2]
          .trim()
          .split(/\s+/)
          .filter((num) => winNums.has(num));

        return (acc += winners.reduce((a) => (a === 0 ? 1 : a * 2), 0));
      }, 0) + ''
  );
}

type Card = { card: string; winCount: number };

export const expectedPartTwoSampleOutput = '30';

export function solvePartTwo(input: string): string {
  const cards = input
    .trim()
    .split('\n')
    .reduce((acc, card) => {
      const c = card.split(/[:|]/);

      const winNums = new Set(c[1].trim().split(/\s+/));

      const winners = c[2]
        .trim()
        .split(/\s+/)
        .filter((n) => winNums.has(n));

      return [...acc, { card: c[0].split(/\s+/)[1], winCount: winners.length }];
    }, [] as Card[]);

  const getCardWins = ({ card, winCount }: Card): number => {
    if (!winCount) return 0;

    const additionalWins = new Array(winCount)
      .fill(null)
      .map((_, idx) => cards[+card + idx]);

    return (
      winCount +
      additionalWins.reduce((acc, card) => (acc += getCardWins(card)), 0)
    );
  };

  return (
    cards.length +
    cards.reduce((acc, card) => (acc += getCardWins(card)), 0) +
    ''
  );
}
