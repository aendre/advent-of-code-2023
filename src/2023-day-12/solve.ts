import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

function hasUnknown(springs:string) {
  return springs.indexOf('?') > -1
}

function replaceAt(str:string, index:number, replacement:string) {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

function meetsCriteria(springs:string, groups:number[]) {
  if (hasUnknown(springs)) {
    return false
  }
  const newGroups = _.trim(springs, '.').replaceAll(/(\.)+/gi, '.').split('.');
  return newGroups.length === groups.length && groups.every((group, index) => typeof newGroups[index] !== 'undefined' && group === newGroups[index].length)
}

function generateAllCombination(springs:string[]) {
  const variations:string[] = []
  springs.forEach(spring => {
    if (!hasUnknown(spring)) {
      variations.push(spring)
    } else {
      const indexOfFirst = spring.indexOf('?');
      if (indexOfFirst !== -1) {
        variations.push(...generateAllCombination([
          replaceAt(spring, indexOfFirst, '.'),
          replaceAt(spring, indexOfFirst, '#'),
        ]))
      }
    }
  })
  return variations
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input()
    .lines()
    .map(line => {
      const [springs, groups] = line.split(' ')
      return {
        springs, groups: groups.split(',').map(AocPuzzle.parseInt),
      }
    })

  const result = input.map((line, lineNr) => {
    const combinations = generateAllCombination([line.springs])
    console.log(`line ${lineNr + 1}: `, combinations.length)
    return combinations
      .map(spring => meetsCriteria(spring, line.groups))
      .filter(x => x === true).length
  })
  AocPuzzle.answer(_.sum(result))

  meetsCriteria('.###.##.....', [3, 2, 1])
}
