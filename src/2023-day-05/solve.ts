import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

// Array:  _.first, _.last, _.chunk, _.difference, _.intersection, _.union, _.uniq
// String: trim, endsWith, startsWith, _.words
// Math: _.max, _.min, _.mean, _.sum
// Utils: _.times, _.matches, _.over

function seedToLocation(seeds: number[], map:number[][]) {
  return seeds.map(seed => {
    let location = seed;
    for (let mapIndex = 0; mapIndex < map.length; mapIndex += 1) {
      const [destStart, sourceStart, length] = map[mapIndex];
      if (seed >= sourceStart && seed <= sourceStart + length) {
        location = destStart + (seed - sourceStart)
        break;
      }
    }
    return location
  })
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input().split('\n\n')
  const seeds = input.shift()?.split(': ').pop()?.split(' ')
    .map(AocPuzzle.parseInt) as number[];
  const maps = input.map(m => m.split(':\n').pop()?.split('\n').map(w => _.words(w).map(AocPuzzle.parseInt))) as number[][][];

  let min = _.min(seeds)
  let location: number[] = [min]
  maps.forEach(map => {
    location = seedToLocation(location, map)
  })

  AocPuzzle.answer(_.min(location))

  // console.log(seeds.every((seed,i)=> seed<), location)
  // const moreSeeds = _.chunk(seeds, 2).map(ranges => {
  //   const [start, length] = ranges;
  //   return _.range(start, start + length)
  // })
  // 3_640_772_818 104_094_365

  // const flatSeeds = moreSeeds.flat(1)

  // console.log(flatSeeds)
}
