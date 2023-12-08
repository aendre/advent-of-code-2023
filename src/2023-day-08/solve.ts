import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

type Node = {
  L:string;
  R:string;
}

function countStepsToZ(start:string, instructions:string[], network:Map<string, Node>, ending:string) {
  let steps = 0;
  let location = start
  while (!location.endsWith(ending)) {
    const currentInstruction = instructions[steps % (instructions.length)] as 'L' | 'R'
    const node = network.get(location);
    if (node) {
      location = node[currentInstruction]
    }
    steps += 1;
  }
  return steps
}

export default function solve(aoc: AocPuzzle) {
  const input = aoc.input().lines()

  const instructions = input.shift()!.split('');
  input.shift();

  const nodes = new Map<string, Node>()
  const roots:string[] = []
  input.map(row => {
    const root = row.split(' = ').shift()!
    const [left, right] = row.replaceAll(')', '').split('= (').pop()!.split(', ')
    nodes.set(root, { L: left, R: right })
    roots.push(root)
  })

  // Part 1
  AocPuzzle.answer(countStepsToZ('AAA', instructions, nodes, 'ZZZ'))

  // Part 2
  const part2 = roots
    .filter(root => root.slice(-1) === 'A')
    .map(start => countStepsToZ(start, instructions, nodes, 'Z'))
  AocPuzzle.answer(math.lcm(...part2)) // math typing is actually wrong :(
}
