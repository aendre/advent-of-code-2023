import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

// Array:  _.first, _.last, _.chunk, _.difference, _.intersection, _.union, _.uniq
// String: trim, endsWith, startsWith, _.words
// Math: _.max, _.min, _.mean, _.sum
// Utils: _.times, _.matches, _.over

function seedToMapLocation(seed: number, map:number[][]) {
  let location = seed;
  for (let mapIndex = 0; mapIndex < map.length; mapIndex += 1) {
    const [destStart, sourceStart, length] = map[mapIndex];
    if (seed >= sourceStart && seed <= sourceStart + length) {
      location = destStart + (seed - sourceStart)
      break;
    }
  }
  return location
}

let seedToFinalDestination = function seedToFinalDestination(seed:number, maps:number[][][]) {
  let location = seed
  maps.forEach(map => {
    location = seedToMapLocation(location, map)
  })
  return location
}

seedToFinalDestination = _.memoize(seedToFinalDestination)

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input().split('\n\n')
  const seeds = input.shift()?.split(': ').pop()?.split(' ')
    .map(AocPuzzle.parseInt) as number[];
  const maps = input.map(m => m.split(':\n').pop()?.split('\n').map(w => _.words(w).map(AocPuzzle.parseInt))) as number[][][];

  const seedGroups = _.chunk(seeds, 2).map(ranges => {
    const [start, count] = ranges;
    return { start, count }
  })

  let min = seedToFinalDestination(seedGroups[0].start, maps)
  seedGroups.forEach(group => {
    for (let i = group.start; i <= group.start + group.count; i += 1) {
      let current = seedToFinalDestination(i, maps)
      if (current < min) {
        min = current
      }
    }
  })

  AocPuzzle.answer(min)

  // const lowest = _.minBy(moreSeeds, 'count')!
  // console.log(lowest)
  // const moreSeeds2 = _.range(79, 79 + 14s)
  // console.log(moreSeeds2)

  // let location: number[] = [...moreSeeds2]
  // maps.forEach(map => {
  //   location = seedToLocation(location, map)
  // })

  // const part1 = seeds.map(seed => seedToFinalDestination(seed, maps))
  // AocPuzzle.answer(_.min(part1))

  // console.log(seeds.every((seed,i)=> seed<), location)
  // 3_640_772_818 104_094_365

  // console.log(flatSeeds)
}
