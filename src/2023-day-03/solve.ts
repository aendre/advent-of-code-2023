import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';
import { Coordinate, Point2D } from '../utils/2D.js';

type NumberBoundaries = {
  boundaries: Point2D[],
  content: number
}

function hasAdjacentSymbol(searchSpace: Point2D[], symbols:Point2D[]) {
  return searchSpace.some(p => symbols.find(s => s.is(p.xy)))
}

function getCoverCoordinates(str:string, startingX:number, startingY: number) {
  const searchSpace: Point2D[] = []
  const endIndex = startingX + str.length - 1;
  for (let i = startingX - 1; i <= endIndex + 1; i += 1) {
    searchSpace.push(new Point2D([i, startingY - 1]))
    searchSpace.push(new Point2D([i, startingY]))
    searchSpace.push(new Point2D([i, startingY + 1]))
  }
  return searchSpace
}

export default function solve(aoc: AocPuzzle) {
  const lines = aoc.input().lines();
  const symbols:Point2D[] = []

  // Get all symbols
  lines.forEach((line, y) => {
    const letters = line.split('')
    letters.forEach((letter, x) => {
      if (Number.isNaN(parseInt(letter, 10)) && letter !== '.') {
        symbols.push(new Point2D([x, y], letter))
      }
    })
  })

  const part1: number[] = []
  const allNumbers: NumberBoundaries[] = []

  lines.forEach((line, y) => {
    const numbers = _.words(line);
    let searchFromIndex = 0;
    numbers.forEach(number => {
      const x = line.indexOf(number, searchFromIndex)
      const endIndex = x + number.length - 1;
      searchFromIndex = endIndex + 1;
      const searchSpace: Point2D[] = getCoverCoordinates(number, x, y)
      const parsedNumber = parseInt(number, 10);

      allNumbers.push({
        boundaries: searchSpace,
        content: parsedNumber,
      })

      if (hasAdjacentSymbol(searchSpace, symbols)) {
        part1.push(parsedNumber)
      }
    })
  })

  AocPuzzle.answer(_.sum(part1))

  const part2: number[] = [];
  const gears = symbols.filter(p => p.content === '*')

  gears.forEach(gear => {
    const adjacentNumbers = allNumbers.filter(number => {
      const boundaries = number.boundaries.map(p => p.key)
      return _.intersection([gear.key], boundaries).length > 0;
    })

    if (adjacentNumbers.length === 2) {
      part2.push(math.prod(adjacentNumbers.map(x => x.content)))
    }
  })
  AocPuzzle.answer(_.sum(part2))
}
