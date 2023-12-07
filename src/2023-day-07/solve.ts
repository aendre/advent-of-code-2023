import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

function handScore(hand:string) {
  const lengths = Array.from(hand).map(letter => hand.split(letter).length - 1)
  return AocPuzzle.parseInt(lengths.sort((a, b) => b - a).join(''))
}

function jokerScore(hand:string) {
  const lengths = Array.from(hand).filter(c => c !== '0').map(letter => ({
    letter,
    occ: hand.split(letter).length - 1,
  }))
  lengths.sort((a, b) => b.occ - a.occ)
  const char = _.maxBy(lengths, 'occ')

  if (typeof char === 'undefined') {
    return handScore(hand)
  }
  return handScore(hand.replaceAll('0', char.letter))
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input()
    .lines()
    .map(line => {
      let [hand, bid] = line.split(' ')
      // Z, Y, X, V, T
      // A, K, Q, J, T
      hand = hand.replaceAll('A', 'Z')
        .replaceAll('K', 'Y')
        .replaceAll('Q', 'X')
        .replaceAll('J', '0') // Map J to V for part 1

      return { hand, bid: AocPuzzle.parseInt(bid) }
    })

  input.sort((a, b) => {
    const kindA = jokerScore(a.hand);
    const kindB = jokerScore(b.hand);

    if (kindA !== kindB) {
      return kindB - kindA;
    }

    return b.hand.localeCompare(a.hand)
  })
  input.reverse()

  const result = input.map((item, index) => item.bid * (index + 1))
  // 250520536 is too high
  // 250341772 is too low
  // 250146490 - wrong
  AocPuzzle.answer(_.sum(result))
}
