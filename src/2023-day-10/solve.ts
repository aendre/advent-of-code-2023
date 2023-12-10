/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';
import { Direction, Point2D, oppositeDirection } from '../utils/2D.js';

const pipeMap: Record<string, Direction[]> = {
  L: [Direction.Up, Direction.Right],
  F: [Direction.Down, Direction.Right],
  J: [Direction.Up, Direction.Left],
  7: [Direction.Left, Direction.Down],
  '|': [Direction.Up, Direction.Down],
  '-': [Direction.Left, Direction.Right],
  S: [Direction.StayStill, Direction.StayStill],
}

export function getNeighbours(start: Point2D, map:Map<string, Point2D>) : Point2D[] {
  const neighbours: Point2D[] = []

  start.get4Neighbours().forEach(p => {
    const newPoint = map.get(p.key)
    if (typeof newPoint !== 'undefined') {
      neighbours.push(newPoint)
    }
  })

  return neighbours;
}

function getLoop(start:Point2D, startDirection:Direction, map:Map<string, Point2D<string>>):string[] {
  let nextDirection = startDirection
  let current = map.get(start.stepOnCanvas(nextDirection).key)
  const loop : string[] = [current!.key]
  while (typeof current !== 'undefined' && current.key !== start.key) {
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    nextDirection = pipeMap[(current.content as string)]
      .filter(d => d !== oppositeDirection(nextDirection)).pop()!
    current = map.get(current.stepOnCanvas(nextDirection).key)!
    loop.push(current.key)
  }
  return loop
}

function wayOut(start:Point2D, map:Map<string, Point2D>, visited:string[], width:number, height:number):boolean {
  // you are out
  if (start.x === 0 || start.y === 0 || start.x === width - 1 || start.y === height - 1) {
    return true;
  }
  const neigh = getNeighbours(start, map).filter(p => !visited.includes(p.key))
  let isThereAWayOut = false;
  for (let i = 0; i < neigh.length; i += 1) {
    isThereAWayOut = wayOut(neigh[i], map, [...visited, neigh[i].key], width, height)
    if (isThereAWayOut) {
      break
    }
  }

  return isThereAWayOut
}

export default function solve(aoc: AocPuzzle) {
  const grid:Point2D[] = [];
  const map = new Map<string, Point2D<string>>()
  const emptyMap = new Map<string, Point2D<string>>()
  let S: Point2D;

  const input = aoc.input().lines();
  const height = input.length;
  const width = input[0].length;

  input.forEach((line, y) => line.split('').forEach((char, x) => {
    const p = new Point2D([x, y], char)
    if (char !== '.') {
      grid.push(p)
      map.set(p.key, p)
      if (char === 'S') {
        S = p
      }
    }
  }))

  const dir = Direction.Left; // PROD Staring direction
  // const dir = Direction.Down; // DEV Staring direction
  const loop = getLoop(S, dir, map)
  const l = loop.length;

  // Part 1
  const result = Math.floor(l / 2) + (l % 2)
  AocPuzzle.answer(result)

  // Part 2
  input.forEach((line, y) => line.split('').forEach((char, x) => {
    const p = new Point2D([x, y], char)
    if (!loop.includes(p.key)) {
      emptyMap.set(p.key, p)
    }
  }))

  let part2 = 0
  // emptyMap.forEach((p, key) => {
  //   if (!wayOut(p, emptyMap, [], width, height)) {
  //     part2 += 1;
  //   }
  // })

  // 498 - too high
  AocPuzzle.answer(part2)
}
