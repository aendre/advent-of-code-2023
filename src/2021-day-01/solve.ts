import _ from 'lodash';
import { AocPuzzle } from '../utils/aoc.js';

export default function solve(aoc: AocPuzzle) {
  let count = 0;

  const result = aoc.input.split('\n')
    .map(i => parseInt(i, 10))
    .forEach((value, index, arr) => {
      count += (index > 0 && value > arr[index - 1]) ? 1 : 0;
    });

  let count2 = 0;
  const result2 = aoc.input.split('\n')
    .map(i => parseInt(i, 10))
    .forEach((value, index, arr) => {
      if (index > 2) {
        const prev = arr[index - 1] + arr[index - 2] + arr[index - 3];
        const current = arr[index] + arr[index - 1] + arr[index - 2];
        count2 += (current > prev) ? 1 : 0;
      }
    });

  aoc.answer(count);
  aoc.answer(count2);
}
