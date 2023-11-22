import axios from 'axios';
import * as fs from 'fs';
import _ from 'lodash';
import { createTemplate } from './template.js';

const dayOfAoc = process.argv[2] || new Date().getDate();
const yearOfAoc = process.argv[3] || new Date().getFullYear().toString();

export function leadingZeroDay(day) {
  return (`0${day}`).slice(-2); // Day with leadin zeroes
}

export const puzzle = {
  day: dayOfAoc,
  dday: leadingZeroDay(dayOfAoc),
  year: yearOfAoc,
}

export function startDay() {
  console.log('\x1b[33m%s\x1b[0m', `\n 🎄 ${puzzle.year}, Day ${puzzle.dday}`); // cyan
  createTemplate(puzzle.dday)
}

export function endDay() {
  console.log('\x1b[32m%s\x1b[0m', '----------------------------------------------------------')
  console.timeEnd('AoC execution')
}

/**
 * @param {string} filename - Name of the file
 */
export function readInput(filename) {
  console.log('\x1b[33m%s\x1b[0m', ` 🚀 ${filename}`);
  console.log('\x1b[32m%s\x1b[0m', '----------------------------------------------------------')
  const filePath = `src/day-${puzzle.dday}/${filename}`;
  const fileContent = fs.readFileSync(filePath, 'utf8');
  console.time('AoC execution')
  return fileContent
}

export function input() {
  return readInput('input.txt')
}
export function inputE() {
  return readInput('example.txt')
}

/**
 * @param {string} year - YYYY
 * @param {string} day - DD
 * @param {string} sessionCookie - Its a has that represents the cookie
 */
export async function downloadInput(year, day, sessionCookie) {
  const response = await axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
    withCredentials: true,
    headers: {
      cookie: `session=${sessionCookie}`,
    },
  });

  // Strip last new line character
  return response.data.replace(/\n$/, '');
}

/**
 * @param {string} day - DD
 */
export async function autoDownload(day) {
  const dayday = leadingZeroDay(day);
  const { year } = puzzle;
  const now = new Date();
  const aocDate = new Date(`${year}-12-${dayday}`)

  if (aocDate > now) {
    console.log('\x1b[33m%s\x1b[0m', ' 🏗️  No input downloaded from the future');
    return
  }

  const sessionCookie = fs.readFileSync('.session.cfg', 'utf-8');
  const filePath = `src/day-${dayday}/input.txt`;

  if (!fs.existsSync(filePath)) {
    const content = await downloadInput(year, day, sessionCookie)
    fs.writeFileSync(filePath, content, {
      encoding: 'utf8',
    })
    console.log('\x1b[33m%s\x1b[0m', ` 🏗️  New input downloaded: ${filePath}`);
  }
}

export function patternMatch(str, matcher) {
  // https://digitalfortress.tech/tips/top-15-commonly-used-regex/
  // https://javascript.plainenglish.io/the-7-most-commonly-used-regular-expressions-in-javascript-bb4e98288ca6
  const regExpMap = {
    $int: {
      regexp: '(\\d+)',
      initializer: Number,
    },
    $signedint: {
      regexp: '([-+]?\\d+)',
      initializer: Number,
    },
    $str: {
      regexp: '([a-zA-Z]+)',
      initializer: String,
    },
    $float: {
      regexp: '(\\d*\\.\\d+)',
      initializer: Number,
    },
  }

  const tokenMatcher = `${Object.keys(regExpMap).map(_.escapeRegExp).map(c => `(${c})`).join('|')}`

  const tokens = matcher.match(new RegExp(tokenMatcher, 'g'))
  if (tokens === null) {
    throw new Error('No tokens were found in the input string')
  }

  let inputMatcherRegExp = matcher;
  Object.keys(regExpMap).forEach(key => {
    inputMatcherRegExp = inputMatcherRegExp.replace(new RegExp(_.escapeRegExp(key), 'g'), regExpMap[key].regexp)
  })

  let matches = str.match(new RegExp(inputMatcherRegExp));

  if (matches === null) {
    return tokens.map(t => null)
  }
  // Drop the full match
  matches = matches.slice(1);

  // Safe check
  if (matches.length !== tokens.length || matches.length < 1) {
    return tokens.map(t => null)
  }

  // Return inputs in the matching type
  return matches.map((match, index) => regExpMap[tokens[index]].initializer(match))
}

export class AocInput {

  static EXAMPLE_FILE = 'example.txt'

  static REAL_INPUT = 'input.txt'

  useInput(inputFile) {
    this.usedFile = inputFile
  }

  load() {
    this.content = readInput(this.usedFile)
  }

  useExample() {
    this.useInput(AocInput.EXAMPLE_FILE);
    this.load()
    return this
  }

  useRealInput() {
    this.useInput(AocInput.REAL_INPUT);
    this.load()
    return this
  }

  get raw() {
    if (typeof this.content !== 'string' || this.content.length < 1) {
      throw Error(`Input (${this.usedFile}) was not read or empty.`)
    }
    return this.content
  }

  get lines() {
    return this.raw.split('\n')
  }
}
