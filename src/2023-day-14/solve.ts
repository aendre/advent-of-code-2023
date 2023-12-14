import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';
import { Direction, Grid, Point2D } from '../utils/2D.js';

// shit isn't very nice... it was too morning :)
function tilt(column:Grid, dir:Direction):Grid {
  let moved = false
  // eslint-disable-next-line no-restricted-syntax
  for (const rock of column.points) {
    if (rock[1].content === 'O') {
      const posToNorth = column.points.get(rock[1].stepOnCanvas(dir).key)
      if (typeof posToNorth !== 'undefined' && posToNorth.content === '.') {
        moved = true;
        rock[1].content = '.'
        posToNorth.content = 'O'
        break;
      }
    }
  }
  const newGrid = new Grid().fromMap(column.points)
  return moved ? tilt(newGrid, dir) : newGrid
}

function tiltDish(grid:Grid, dir:Direction) {
  const newPoints:Point2D[] = []
  const func = (dir === Direction.Up || dir === Direction.Down) ? 'column' : 'row';
  const limit = (dir === Direction.Up || dir === Direction.Down) ? grid.width : grid.height

  for (let columnIndex = 0; columnIndex < limit; columnIndex++) {
    const side = grid[func](columnIndex);
    newPoints.push(...tilt(side, dir).toArray())
  }

  return new Grid().fromArray(newPoints, grid.width, grid.height)
}

const cycle = (grid:Grid) => {
  let newGrid = tiltDish(grid, Direction.Up)
  newGrid = tiltDish(newGrid, Direction.Left)
  newGrid = tiltDish(newGrid, Direction.Down)
  newGrid = tiltDish(newGrid, Direction.Right)
  return newGrid
}

function weight(grid:Grid) {
  const weights = _.times(grid.height)
    .map(rowIndex => grid
      .row(rowIndex)
      .toArray()
      .filter(c => c.content === 'O').length * (grid.height - rowIndex))

  return _.sum(weights)
}

function detectCycle(grid:Grid) {
  let newGrid = grid.clone()
  const cycles = new Map<string, number>()
  let cycleLength = 0
  let offset = 0
  let iteration = 0;
  while (true || iteration < 10_000) {
    newGrid = cycle(newGrid)
    const gridKey = newGrid.toString();
    if (cycles.has(gridKey)) {
      offset = cycles.get(gridKey)!;
      cycleLength = iteration - offset
      break;
    }
    cycles.set(gridKey, iteration)
    iteration += 1;
  }
  return { offset, repeatsAt: cycleLength }
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.inputE();
  const grid = new Grid().fromString(input)

  // Part 1
  const newGrid = tiltDish(grid, Direction.Up)
  AocPuzzle.answer(weight(newGrid))

  // Part 2
  const c = detectCycle(grid)
  const part2Iterations = ((1000000000 - c.offset) % c.repeatsAt) - 1

  let part2Grid = grid.clone();
  _.times(part2Iterations).forEach(() => {
    part2Grid = cycle(part2Grid)
  })

  // 63 - wrong
  // 64 - wrong
  // 65 - wrong
  // 68 - wrong
  // 69 - wrong ... shit I have sent the result from example input :D :D
  AocPuzzle.answer(weight(part2Grid))
}
