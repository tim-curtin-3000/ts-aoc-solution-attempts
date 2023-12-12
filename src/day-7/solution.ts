type Hand = {
  hand: string;
  sortedHand: string;
  bid: number;
  initialRank: number;
};

const cardMap: Record<string, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
};

const cardMapWithJoker = { ...cardMap, J: 1 };

const getInitialHandRank = (sortedHand: string) => {
  const fiveOfAKind = /^(\w)\1*$/g;
  /* All these will match multiple times */
  const fourOfAKind = /((\w)\2{3})/g;
  const threeOfAKind = /((\w)\2{2})/g;
  const hasPair = /((\w)\2{1})/g;

  if (sortedHand.length === 5 && fiveOfAKind.test(sortedHand)) return 7;

  if (fourOfAKind.test(sortedHand)) return 6;

  if (threeOfAKind.test(sortedHand)) {
    /* need to test if this is a full house */
    const remainder = sortedHand.replace(threeOfAKind, '');
    return hasPair.test(remainder) ? 5 : 4;
  }

  const pairs = sortedHand.match(hasPair) || [];
  return pairs.length + 1;
};

const getInitialHandRankWithJoker = (sortedHand: string) => {
  const numJokers = sortedHand.match(/J/g)!.length;

  if (numJokers >= 4) return 7;

  const rankWithoutJokers = getInitialHandRank(sortedHand.replace(/J/g, ''));

  switch (numJokers) {
    case 1: {
      // 4 cards
      if (rankWithoutJokers === 6) return 7;
      if (rankWithoutJokers === 4) return 6;
      if (rankWithoutJokers === 3) return 5;
      if (rankWithoutJokers === 2) return 4;
      if (rankWithoutJokers === 1) return 2;
    }
    case 2: {
      // 3 cards
      if (rankWithoutJokers === 4) return 7;
      if (rankWithoutJokers === 2) return 6;
      if (rankWithoutJokers === 1) return 4;
    }
    case 3: {
      // 2 cards
      if (rankWithoutJokers === 2) return 7;
      if (rankWithoutJokers === 1) return 6;
    }
  }
  return 1;
};

const getCardSorter = (map: Record<string, number> = cardMap) => {
  return (a: Hand, b: Hand) => {
    if (a.initialRank === b.initialRank) {
      for (let i = 0; i < 5; i++) {
        if (a.hand[i] !== b.hand[i]) {
          return map[a.hand[i]] - map[b.hand[i]];
        }
      }
    }
    return a.initialRank - b.initialRank;
  };
};

/* Solutions */

export const expectedPartOneSampleOutput = '6440';

export function solvePartOne(input: string): string {
  const processedHands = input
    .trim()
    .split('\n')
    .reduce((hands, line) => {
      const [hand, bid] = line.split(' ');
      const sortedHand = hand
        .split('')
        .sort((a, b) => a.localeCompare(b))
        .join('');

      return [
        ...hands,
        {
          hand,
          sortedHand,
          bid: +bid,
          initialRank: getInitialHandRank(sortedHand),
        },
      ];
    }, [] as Hand[]);

  return (
    processedHands
      .sort(getCardSorter())
      .reduce((total, hand, idx) => (total += hand.bid * (idx + 1)), 0) + ''
  );
}

export const expectedPartTwoSampleOutput = '5905';

export function solvePartTwo(input: string): string {
  const processedHands = input
    .trim()
    .split('\n')
    .reduce((hands, line) => {
      const [hand, bid] = line.split(' ');
      const sortedHand = hand
        .split('')
        .sort((a, b) => a.localeCompare(b))
        .join('');

      return [
        ...hands,
        {
          hand,
          sortedHand,
          bid: +bid,
          initialRank: hand.includes('J')
            ? getInitialHandRankWithJoker(sortedHand)
            : getInitialHandRank(sortedHand),
        },
      ];
    }, [] as Hand[]);

  return (
    processedHands
      .sort(getCardSorter(cardMapWithJoker))
      .reduce((total, hand, idx) => (total += hand.bid * (idx + 1)), 0) + ''
  );
}
