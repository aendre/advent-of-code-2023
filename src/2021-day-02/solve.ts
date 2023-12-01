import { _, math, patternMatch } from '../utils/libs.js'
import { AocPuzzle } from '../utils/aoc.js';
import { Point2D } from '../utils/2D.js';

export default function solve(aoc: AocPuzzle) {
  const rows = aoc.input().lines()
    .map(row => {
      const [command, step] = row.split(' ')
      return { command, step: parseInt(step, 10) }
    })

  let pos = new Point2D([0, 0])
  let aim = 0;

  rows.forEach(command => {
    if (command.command === 'forward') {
      pos = pos.move([command.step, command.step * aim])
    } else if (command.command === 'down') {
      // pos = pos.move([0, command.step])
      aim += command.step
    } else {
      aim -= command.step
      // pos = pos.move([0, -command.step])
    }
  })

  console.log(pos)
  AocPuzzle.answer(pos.x * pos.y);
}
