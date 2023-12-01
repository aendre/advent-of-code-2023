import { number } from 'mathjs';
import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input
    .lines()
    .map(i => i.replaceAll('one', 'o1e')
      .replaceAll('nine', 'n9e')
      .replaceAll('eight', 'e8t')
      .replaceAll('two', 'tw2o')
      .replaceAll('three', 't3e')
      .replaceAll('four', 'f4r')
      .replaceAll('five', 'f5e')
      .replaceAll('six', 's6x')
      .replaceAll('seven', 's7n'))

  const result = input.map(item => {
    const numbers = item.split('').filter(nr => !Number.isNaN(parseInt(nr, 10)))
    return parseInt(`${_.first(numbers)}${_.last(numbers)}`, 10)
  })

  aoc.part1(_.sum(result))
}
