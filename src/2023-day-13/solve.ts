import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';
import { Grid, Point2D } from '../utils/2D.js';

function getMirrorPosition(valley:Grid, direction: 'HORIZONTAL' | 'VERTICAL', ignoreScore = -1) {
  let mirroringIndex = 0;
  const end = direction === 'HORIZONTAL' ? valley.height : valley.width;
  const funcName = direction === 'HORIZONTAL' ? 'row' : 'column';
  const multiplier = (direction === 'HORIZONTAL' ? 100 : 1)

  for (let position = 0; position < end; position++) {
    const range = Math.min(end - position, position, Math.floor(end / 2))
    const left = _.range(position - range, position).reverse();
    const right = _.range(position, position + range)

    if (left.length === 0 || right.length === 0) continue;

    const isMirror = left.every((columnIndex, index) => valley[funcName](columnIndex).toString() === valley[funcName](right[index]).toString())
    if (isMirror && ignoreScore !== (position * multiplier)) {
      mirroringIndex = position;
      break;
    }
  }

  return mirroringIndex * multiplier
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input().split('\n\n')
  const valleys = input.map(valley => new Grid().fromString(valley))

  // Part 1
  const part1 = valleys.map(valley => getMirrorPosition(valley, 'VERTICAL') + getMirrorPosition(valley, 'HORIZONTAL'))
  AocPuzzle.answer(_.sum(part1))

  // Part 2
  const part2 = valleys.map((valley, vindex) => {
    const originalV = getMirrorPosition(valley, 'VERTICAL');
    const originalH = getMirrorPosition(valley, 'HORIZONTAL');
    let score = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const smudge of valley.points.values()) {
      const newValley = valley.clone();
      const newSmudge = smudge.content === '.' ? '#' : '.';
      newValley.points.set(smudge.key, new Point2D([smudge.x, smudge.y], newSmudge))
      const newV = getMirrorPosition(newValley, 'VERTICAL', originalV);
      const newH = getMirrorPosition(newValley, 'HORIZONTAL', originalH);

      // we have found it
      if ((originalH !== newH || originalV !== newV) && ((newV + newH) !== 0)) {
        score = newV !== originalV && newV !== 0 ? newV : newH;
        break;
      }
    }

    return score
  })

  // 23846 - is too low
  // 26163 - is too low
  AocPuzzle.answer(_.sum(part2))
}
