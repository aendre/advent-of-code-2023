import { number } from 'mathjs';
import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

function ways(time:number, record:number) {
  const speeds = _.range(time)
  const beaten = speeds.map(speed => {
    const remainingTime = time - speed;
    return speed * remainingTime
  }).filter(dist => dist > record)
  return beaten.length
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input()
    .lines();

  const times = _.words(_.first(input)?.split(':').pop()).map(AocPuzzle.parseInt)
  const distance = _.words(_.last(input)?.split(':').pop()).map(AocPuzzle.parseInt)

  // Part 1 begins
  const part1 = times.map((time, index) => ways(time, distance[index]))
  AocPuzzle.answer(math.prod(part1))

  // Part 2 begins
  const bigTime = AocPuzzle.parseInt(times.join(''))
  const bigDist = AocPuzzle.parseInt(distance.join(''))
  AocPuzzle.answer(ways(bigTime, bigDist))
}
