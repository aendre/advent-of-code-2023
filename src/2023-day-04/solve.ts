import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

function spawnCards(cardWins:number[], index:number): number {
  const nrOfWins = cardWins[index];
  if (nrOfWins === 0 || typeof nrOfWins === 'undefined') {
    return 0;
  }
  const spawnedCards = _.times(nrOfWins).map(nextIndex => spawnCards(cardWins, index + nextIndex + 1));
  return _.sum(spawnedCards) + nrOfWins
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input()
    .lines()
    .map(line => {
      const [first, second] = line.split(' | ')
      const winningraw = first.split(': ').pop();
      const bag = _.words(second).map(AocPuzzle.parseInt)
      const winning = _.words(winningraw).map(AocPuzzle.parseInt)
      return { bag, winning }
    })

  const part1 = input.map(game => {
    const common = _.intersection(game.winning, game.bag)
    return Math.floor(2 ** (common.length - 1))
  })

  AocPuzzle.answer(_.sum(part1))

  const winnings = input.map(game => _.intersection(game.winning, game.bag).length)
  const part2 = winnings.map((g, i) => spawnCards(winnings, i))
  AocPuzzle.answer(_.sum(part2) + winnings.length)
}
