function generateUniqueRandomSum(count: number, total: number): number[] {
  const minPossibleSum = (count * (count - 1)) / 2;
  const adjustedTotal = total - minPossibleSum;

  if (adjustedTotal < 0) {
    throw new Error("Impossible: total too small for unique values");
  }

  // Generate `count - 1` random cut points in the range [0, adjustedTotal]
  const cuts = new Set<number>();
  while (cuts.size < count - 1) {
    cuts.add(Math.floor(Math.random() * (adjustedTotal + 1)));
  }

  const sortedCuts = Array.from(cuts).sort((a, b) => a - b);
  const raw: number[] = [];
  let prev = 0;
  for (const cut of sortedCuts) {
    raw.push(cut - prev);
    prev = cut;
  }
  raw.push(adjustedTotal - prev); // last chunk

  // Add uniqueness offsets (0 through count-1)
  const result = raw.map((x, i) => x + i);

  // Fisher–Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function indexOfMax(arr: number[]): number {
  if (arr.length === 0) return -1;

  return arr.reduce(
    (maxIndex, curr, i, array) => (curr > array[maxIndex] ? i : maxIndex),
    0
  );
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index in [0, i]
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

export { shuffle, indexOfMax, generateUniqueRandomSum };
