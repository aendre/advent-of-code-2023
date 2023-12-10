import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

function interpolate(values:number[], lastInSeries:number[]):number[] {
  let newLast:number[] = lastInSeries.length === 0 ? [_.first(values)!] : [];
  const newValues = values
    .map((value, index) => values[index + 1] - value)
    .filter(i => !Number.isNaN(i))

  newLast = [_.first(newValues)!, ...newLast, ...lastInSeries]

  if (newValues.every(i => i === 0)) {
    return [0, ...lastInSeries]
  }
  return interpolate(newValues, newLast)
}

function predictPart1(values:number[]):number {
  return values.reduceRight((next, sum, index) => sum + next, 0)
}

function predictPart2(values:number[]):number {
  return values.reduce((next, sum, index) => sum - next, 0)
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input()
    .lines()
    .map(line => line.split(' ')
      .map(AocPuzzle.parseInt))

  const part2 = input.map(history => predictPart2(interpolate(history, [])))

  // 21166 - wrong
  // -106 - wrong
  AocPuzzle.answer(_.sum(part2))
}
