import axios from 'axios';
import * as fs from 'fs';
import _ from 'lodash';
import { red, blue, yellow } from 'ansis';
import { spawn } from 'child_process';
import { createTemplate } from './template.js';

export type AocPuzzleInfo = {
  day: string,
  dday: string,
  year: string,
  dirName: string
}

function leadingZeroDay(day: string | number) {
  return (`0${day}`).slice(-2); // Day with leadin zeroes
}

function getAocDay(): AocPuzzleInfo {
  // Get 2nd argument or set it to the current date
  const dayOfAoc = process.argv[2] || (new Date().getDate()).toString();
  // Get the 3rd argument or set it to current year
  const yearOfAoc = process.argv[3] || new Date().getFullYear().toString();
  const dayOfAocWithLeadingZeros = leadingZeroDay(dayOfAoc);

  return {
    day: dayOfAoc,
    dday: dayOfAocWithLeadingZeros,
    year: yearOfAoc,
    dirName: `${yearOfAoc}-day-${dayOfAocWithLeadingZeros}`,
  };
}

export async function downloadInput(year: string, day: string, sessionCookie: string) {
  const response = await axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
    withCredentials: true,
    headers: {
      cookie: `session=${sessionCookie}`,
    },
  });

  // Strip last new line character
  return response.data.replace(/\n$/, '');
}

export async function savePuzzleInputToDisk(puzzle: AocPuzzleInfo) {
  const now = new Date();
  const aocDate = new Date(`${puzzle.year}-12-${puzzle.dday}`);

  if (aocDate > now) {
    console.log(yellow(' 🏗️  No input downloaded from the future'));
    return;
  }

  const sessionCookie = fs.readFileSync('.session.cfg', 'utf-8');
  const filePath = `src/${puzzle.dirName}/input.txt`;

  if (!fs.existsSync(filePath)) {
    const content = await downloadInput(puzzle.year, puzzle.day, sessionCookie);
    fs.writeFileSync(filePath, content, {
      encoding: 'utf8',
    });
    console.log(yellow(` 🏗️  New input downloaded: ${filePath}`));
  }
}

function pbcopy(data:string) {
  const proc = spawn('pbcopy');
  proc.stdin.write(data); proc.stdin.end();
}

export class AocPuzzle {
  puzzle: AocPuzzleInfo

  constructor(p: AocPuzzleInfo) {
    this.puzzle = p
  }

  private readInput(filename: string) {
    const filePath = `src/${this.puzzle.dirName}/${filename}`;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.time('AoC execution'); // Start counting execution duration from the moment an input in read
    return fileContent;
  }

  input() {
    return this.readInput('input.txt');
  }

  inputE() {
    return this.readInput('example.txt');
  }

  static answer(solution: unknown, copy = true) {
    const stringSolution = `${solution}`
    const canCopy = typeof stringSolution === 'string' && typeof solution !== 'undefined' && solution !== null && copy === true
    if (canCopy) {
      pbcopy(stringSolution)
    }
    console.log(blue('>'));
    console.log(blue('> 🎉 Solution: '), blue.white.bold(`${solution}`), canCopy ? blue.yellow.bold(' Copied to clipboard!') : '');
    console.log(blue('>'));
  }

  static parseInt(input: string) {
    return parseInt(input, 10)
  }

  static decimalToBinary(nr: number) {
    return nr.toString(2);
  }

  static binaryToDecimal(str: string) {
    return parseInt(str, 2);
  }
}

export async function startDay() {
  const puzzle = getAocDay()
  console.log(red(`\n\n 🎄 ${puzzle.year}, Day ${puzzle.dday}`));

  createTemplate(puzzle.dirName);
  await savePuzzleInputToDisk(puzzle);

  const p = new AocPuzzle(puzzle)

  console.log(red('----------------------------------------------------------'));
  (await import(`../${puzzle.dirName}/solve.js`)).default(p);
  console.log(red('----------------------------------------------------------'));
  console.timeEnd('AoC execution');
  console.log(red('\n'));
}
