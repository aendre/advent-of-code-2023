import * as fs from 'fs';
import { yellow } from 'ansis';

export const solveTemplate = `import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';

export default function solve() {
  const input = aoc.inputE();

  console.log('Input:', input)
  // aoc.part1(123)
  // aoc.part2(456)
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
