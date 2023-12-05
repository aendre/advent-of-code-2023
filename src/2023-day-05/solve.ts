import { count } from 'console';
import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

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

function seedToFinalDestination(seed:number, maps:number[][][]) {
  let location = seed
  maps.forEach(map => {
    location = seedToMapLocation(location, map)
  })
  return location
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input().split('\n\n')
  const seeds = input.shift()?.split(': ').pop()?.split(' ')
    .map(AocPuzzle.parseInt) as number[];
  const maps = input.map(m => m.split(':\n').pop()?.split('\n').map(w => _.words(w).map(AocPuzzle.parseInt))) as number[][][];

  // Part 1 begins
  const part1 = seeds.map(seed => seedToFinalDestination(seed, maps))
  AocPuzzle.answer(_.min(part1))

  // Part 2 begins
  const seedRanges = _.chunk(seeds, 2).map(range => ({ start: range[0], end: range[0] + range[1] }))

  const splitRanges = seedRanges.map(range => {
    const rangeLength = range.end - range.start
    const chunkSize = Math.ceil(Math.cbrt(rangeLength))
    const nrOfChunks = Math.floor(rangeLength / chunkSize)

    return [
      range.start,
      ..._.times(nrOfChunks).map(i => range.start + (i + 1) * chunkSize),
      range.end,
    ]
  })

  const part2partial = splitRanges.map(seedRange => seedRange.map((seed, index) => ({
    seed,
    location: seedToFinalDestination(seed, maps),
    index,
  })))
    .map(seedRange => _.minBy(seedRange, 'location')!)

  const part2 = part2partial.map((bestSeed, groupIndex) => {
    let start; let end;
    if (bestSeed?.index === 0) {
      start = splitRanges[groupIndex][bestSeed.index]
      end = splitRanges[groupIndex][bestSeed.index + 1]
    } else if (bestSeed.index === splitRanges[groupIndex].length - 1) {
      start = splitRanges[groupIndex][bestSeed.index - 1]
      end = splitRanges[groupIndex][bestSeed.index]
    } else {
      start = splitRanges[groupIndex][bestSeed.index - 1]
      end = splitRanges[groupIndex][bestSeed.index + 1]
    }
    return _.range(start, end + 1)
  })

  const part2final = part2.flat().map(seed => seedToFinalDestination(seed, maps))
  const part2finalfinal = _.min(part2final) // remebering those good old Photoshop layer names :)

  // ugly as hell, but I had no more time...
  AocPuzzle.answer(part2finalfinal)
}
