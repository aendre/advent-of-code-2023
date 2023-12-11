/* eslint-disable no-constant-condition */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';
import {
  Direction, Point2D, RotationDirection, oppositeDirection, rotate45deg, rotate90deg,
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

function getLoop(start:Point2D, startDirection:Direction, map:Map<string, Point2D>) {
  let nextDirection = startDirection
  let current = map.get(start.stepOnCanvas(nextDirection).key)
  const loop = [{ key: current!.key, dir: nextDirection }]
  while (typeof current !== 'undefined' && current.key !== start.key) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    nextDirection = pipeMap[(current.content as string)]
      .filter(d => d !== oppositeDirection(nextDirection)).pop()!
    current = map.get(current.stepOnCanvas(nextDirection).key)!
    loop.push({ key: current.key, dir: nextDirection })
  }
  return loop
}

function getInnerTiles(loop:{ key:string, dir:Direction }[], map:Map<string, Point2D<string>>, rotation: RotationDirection, width:number, height:number) {
  const visited = new Set<string>();
  for (let i = 0; i < loop.length; i += 1) {
    const tileInLoop = map.get(loop[i].key)!
    let tile = tileInLoop;

    let newDirection = rotate90deg(loop[i].dir, rotation);

    if (['7', 'L'].includes(`${tileInLoop.content}`)) {
      newDirection = rotate45deg(loop[i].dir, rotation);
    } else if (['F', 'J'].includes(`${tileInLoop.content}`)) {
      newDirection = rotate90deg(rotate45deg(loop[i].dir, rotation), rotation);
    }
    while (true) {
      // console.log('steping from ', tile)
      tile = tile.stepOnCanvas(newDirection);
      // console.log('to ', tile)
      const isPipe = typeof loop.find(l => l.key === tile.key) !== 'undefined';
      const isWall = tile.x > width - 1 || tile.y > height - 1 || tile.x < 0 || tile.y < 0;
      if (!isPipe && !isWall && !visited.has(tile.key)) {
        visited.add(tile.key)
      }
      if (isPipe) {
        break;
      }
      if (isWall) {
        // console.log('i hit the wall:', tile, rotation, newDirection, isCorner)
        return 0;
      }
    }
  }

  console.log(visited)

  return visited.size;
}

export default function solve(aoc: AocPuzzle) {
  const map = new Map<string, Point2D<string>>()
  let S = new Point2D([0, 0], 'init');
  const input = aoc.inputE().lines();
  const height = input.length;
  const width = input[0].length;

  input.forEach((line, y) => line.split('').forEach((char, x) => {
    if (char !== '.') {
      const p = new Point2D([x, y], char)
      map.set(p.key, p)
      if (char === 'S') { S = p }
    }
  }))

  // const startingDirection = Direction.Right; // PROD Staring direction
  const startingDirection = Direction.Down; // DEV Staring direction
  const loop = getLoop(S, startingDirection, map)

  // Part 1
  const l = loop.length;
  const result = Math.floor(l / 2) + (l % 2)
  AocPuzzle.answer(result, false)

  // Part 2
  const part2CCW = getInnerTiles(loop, map, RotationDirection.CounterClockWise, width, height)
  const part2CW = getInnerTiles(loop, map, RotationDirection.ClockWise, width, height)

  // 498 - too high
  // 393 - too low
  AocPuzzle.answer(Math.max(part2CCW, part2CW))
}
