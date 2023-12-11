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
  let current = map.points.get(start.stepOnCanvas(nextDirection).key)
  const loop = [{ key: current!.key, dir: nextDirection }]
  while (typeof current !== 'undefined' && current.key !== start.key) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    nextDirection = pipeMap[(current.content as string)]
      .filter(d => d !== oppositeDirection(nextDirection)).pop()!
    current = map.points.get(current.stepOnCanvas(nextDirection).key)!
    loop.push({ key: current.key, dir: nextDirection })
  }
  return loop
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input()
  const map = new Grid().fromString(input)
  const pipes = map.filter(p => p.content !== '.')
  const S = pipes.filter(p => p.content === 'S').toArray().pop()!;

  console.log(S)
  const startingDirection = Direction.Right; // PROD Staring direction
  // const startingDirection = Direction.Down; // DEV Staring direction
  const loop = getLoop(S, startingDirection, pipes)

  // Part 1
  const l = loop.length;
  const result = Math.floor(l / 2) + (l % 2)
  AocPuzzle.answer(result, false)

  // // Part 2
  // const part2CCW = getInnerTiles(loop, map, RotationDirection.CounterClockWise, width, height)
  // const part2CW = getInnerTiles(loop, map, RotationDirection.ClockWise, width, height)

  // // 498 - too high
  // // 393 - too low
  // AocPuzzle.answer(Math.max(part2CCW, part2CW))
}
