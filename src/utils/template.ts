import * as fs from 'fs';

export const solveTemplate = `import _ from 'lodash';
import math from '../utils/math.js'
import * as aoc from '../utils/aoc.js';

export default function solve() {
  const input = aoc.inputE();

  console.log('Input', input)
}
`;
export function createTemplate(day: string) {
  const dir = `src/day-${day}/`
  const solveFile = `${dir}solve.ts`
  const exampleFile = `${dir}example.txt`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    fs.writeFileSync(solveFile, solveTemplate, {
      encoding: 'utf-8',
    })
    fs.writeFileSync(exampleFile, 'example', {
      encoding: 'utf-8',
    })
    console.log('\x1b[33m%s\x1b[0m', ` 🔧 AoC file structure created for Day ${day}`);
  }
}
