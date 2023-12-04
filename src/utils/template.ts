import * as fs from 'fs';
import { yellow } from 'ansis';

export const solveTemplate = `import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

// Array:  _.first, _.last, _.chunk, _.difference, _.intersection, _.union, _.uniq
// String: trim, endsWith, startsWith, _.words
// Math: _.max, _.min, _.mean, _.sum
// Utils: _.times, _.matches, _.over

export default function solve(aoc: AocPuzzle) {
  const input = aoc.inputE()
  // .lines()
  // .map(AocPuzzle.parseInt)

  console.log(input)

  // AocPuzzle.answer('changeme')
}
`;
export function createTemplate(dirName: string) {
  const dir = `src/${dirName}/`;
  const solveFile = `${dir}solve.ts`;
  const exampleFile = `${dir}example.txt`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.writeFileSync(solveFile, solveTemplate, {
      encoding: 'utf-8',
    });
    fs.writeFileSync(exampleFile, 'example', {
      encoding: 'utf-8',
    });
    console.log(yellow(` 🔧 AoC file structure created at ${dir}`));
  }
}
