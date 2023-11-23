import * as fs from 'fs';
import { yellow } from 'ansis';

export const solveTemplate = `import _ from 'lodash';
import math from '../utils/math.js'
import { AocPuzzle } from '../utils/aoc.js';
import { patternMatch } from '../utils/patterns.js';

export default function solve(aoc: AocPuzzle) {
  const rows = aoc.inputE.split('\\n')
  // .map(row => parseInt(row, 10))
  console.log(rows)

  // aoc.part1('changeme')
  // aoc.part2('changeme2')
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
