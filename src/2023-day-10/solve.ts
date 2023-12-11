/* eslint-disable no-constant-condition */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';
import {
  Direction, Grid, Point2D, RotationDirection, oppositeDirection, rotate45deg, rotate90deg,
} from '../utils/2D.js';

const pipeMap: Record<string, Direction[]> = {
  L: [Direction.Up, Direction.Right],
  F: [Direction.Down, Direction.Right],
  J: [Direction.Up, Direction.Left],
  7: [Direction.Left, Direction.Down],
  '|': [Direction.Up, Direction.Down],
  '-': [Direction.Left, Direction.Right],
  S: [Direction.StayStill, Direction.StayStill],
}

function getLoop(start:Point2D, startDirection:Direction, map:Grid) {
  let nextDirection = startDirection
  let current = map.points.get(start.stepOnCanvas(nextDirection).key)!
  const loop = [current]
  while (typeof current !== 'undefined' && current.key !== start.key) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    nextDirection = pipeMap[(current.content as string)]
      .filter(d => d !== oppositeDirection(nextDirection)).pop()!
    current = map.points.get(current.stepOnCanvas(nextDirection).key)!
    loop.push(current)
  }
  return new Grid().fromArray(loop, map.width, map.height)
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input()
  const map = new Grid().fromString(input)
  const pipes = map.filter(p => p.content !== '.')
  const S = pipes.filter(p => p.content === 'S').toArray().pop()!;

  const startingDirection = Direction.Right; // PROD Staring direction
  // const startingDirection = Direction.Down; // DEV Staring direction
  const loop = getLoop(S, startingDirection, pipes)

  // Part 1
  const l = loop.points.size;
  const result = Math.floor(l / 2) + (l % 2)
  AocPuzzle.answer(result, false)

  // Part 2 - kapja be
  let sum = 0
  for (let i = 0; i < map.height; i++) {
    const notInTheLoop = map.row(i).toArray().filter(p => typeof loop.points.get(p.key) === 'undefined')
    sum += _.sum(notInTheLoop.map(p => {
      // count how many times |, J, L appear to the left of it
      let times = _.range(0, p.x).map(x => {
        const tileInTheLoop = loop.points.get(new Point2D([x, p.y]).key)
        return typeof tileInTheLoop !== 'undefined' && ['|', 'L', 'J'].includes(tileInTheLoop.content as string)
      }).filter(pp => pp === true).length

      return (times % 2 === 1) ? 1 : 0
    }))
  }

  // 498 - too high
  // 393 - too low
  // 399 - wrong
  AocPuzzle.answer(sum)
}
