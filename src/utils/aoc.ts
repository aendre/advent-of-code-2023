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

export type AocPuzzle = {
  puzzle: AocPuzzleInfo,
  input: string, // content of input.txt
  inputE: string, // content of example.txt
  parseInt: (input: string) => number
  answer: (result: unknown, copy?:boolean) => void
}

function parseAsInt(input: string) {
  return parseInt(input, 10)
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

export async function savePuzzleInputToDisk() {
  const puzzle = getAocDay();
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

export function readInput(filename: string) {
  // console.log(red(` 🚀 ${filename}`));
  // console.log(red('----------------------------------------------------------'));

  const puzzle = getAocDay();
  const filePath = `src/${puzzle.dirName}/${filename}`;
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return fileContent;
}

export function getPuzzleInput() {
  return readInput('input.txt');
}
export function getPuzzleInputExample() {
  return readInput('example.txt');
}

function pbcopy(data:string) {
  const proc = spawn('pbcopy');
  proc.stdin.write(data); proc.stdin.end();
}

export function answer(solution: unknown, copy = true) {
  const stringSolution = `${solution}`
  const canCopy = typeof stringSolution === 'string' && typeof solution !== 'undefined' && solution !== null && copy === true
  if (canCopy) {
    pbcopy(stringSolution)
  }
  console.log(blue('>'));
  console.log(blue('> 🎉 Solution: '), blue.white.bold(`${solution}`), canCopy ? blue.yellow.bold(' Copied to clipboard!') : '');
  console.log(blue('>'));
}

export async function startDay() {
  const puzzle = getAocDay()
  console.log(red(`\n\n 🎄 ${puzzle.year}, Day ${puzzle.dday}`));

  createTemplate(puzzle.dirName);
  await savePuzzleInputToDisk();

  const input = getPuzzleInput();
  const exampleInput = getPuzzleInputExample();
  const solve: AocPuzzle = {
    puzzle,
    input,
    inputE: exampleInput,
    answer,
    parseInt: parseAsInt,
  }

  console.log(red('----------------------------------------------------------'));
  console.time('AoC execution');
  (await import(`../${puzzle.dirName}/solve.js`)).default(solve);
  console.log(red('----------------------------------------------------------'));
  console.timeEnd('AoC execution');
  console.log(red('\n'));
}
