import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';
import { Direction, Grid, Point2D } from '../utils/2D.js';

function expandUniverse(galaxies:Grid, grid:Grid, expandBy = 1):Grid {
  let expandedGalaxies = galaxies.filter(() => true)

  // Each row
  for (let i = grid.height - 1; i >= 0; i -= 1) {
    const g = galaxies.row(i).toArray()
    if (g.length === 0) {
      const points = expandedGalaxies.toArray().map(point => (point.y > i ? point.move([0, expandBy]) : point))
      expandedGalaxies = new Grid().fromArray(points)
    }
  }

  // Each column
  for (let i = grid.width - 1; i >= 0; i -= 1) {
    const g = galaxies.column(i).toArray()
    if (g.length === 0) {
      const points = expandedGalaxies.toArray().map(point => (point.x > i ? point.move([expandBy, 0]) : point))
      expandedGalaxies = new Grid().fromArray(points)
    }
  }

  return expandedGalaxies
}

function calculatePathLength(galaxies:Grid) {
  let pathLength = 0
  galaxies.toArray().forEach((g, startIndex, gg) => {
    _.range(startIndex + 1, gg.length).forEach(endIndex => {
      const from = gg[startIndex];
      const to = gg[endIndex];
      pathLength += from.manhattanDistanceTo(to)
    })
  })
  return pathLength
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input();
  const grid = new Grid().fromString(input);
  const galaxies = grid.filter(v => v.content === '#');
  const expanded = expandUniverse(galaxies, grid, 1)
  const expandedOld = expandUniverse(galaxies, grid, 999_999)

  const part1 = calculatePathLength(expanded)
  const part2 = calculatePathLength(expandedOld)

  // 827010736819 - too high for part 2
  AocPuzzle.answer(part1)
  AocPuzzle.answer(part2)
}
