import _ from 'lodash';
import math from '../utils/math.js';
import { AocPuzzle } from '../utils/aoc.js';
import { patternMatch } from '../utils/patterns.js';
import { Point2D } from '../utils/2D.js';

export default function solve(aoc: AocPuzzle) {
  const rows = aoc.input.split('\n')
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
  aoc.part1(pos.x * pos.y);
}
