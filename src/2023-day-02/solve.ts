import { _, math, patternMatch } from '../utils/libs.js';
import { AocPuzzle } from '../utils/aoc.js';

export default function solve(aoc: AocPuzzle) {
  const games = aoc.inputE()
    .lines()
    .map(i => {
      const [game, rest] = i.split(':')
      return rest
    })
    .map(game => game.split(';')
      .map(individual => individual.trim().split(', ').map(series => {
        const [count, color] = series.split(' ')
        return {
          count: parseInt(count, 10),
          color,
        }
      })))

  const pos:number[] = [];
  const colorAllowed = {
    red: 12,
    green: 13,
    blue: 14,
  }

  games.forEach((game, index) => {
    const gg = game.flat()
    const posible = gg.every(g => colorAllowed[g.color] >= g.count)
    if (posible) {
      pos.push(index + 1)
    }
  })
  AocPuzzle.answer(_.sum(pos))

  const part2games = games.map(game => {
    const flat = game.flat()
    const green = _.max(flat.filter(x => x.color === 'green').map(x => x.count)) ?? 0
    const red = _.max(flat.filter(x => x.color === 'red').map(x => x.count)) ?? 0
    const blue = _.max(flat.filter(x => x.color === 'blue').map(x => x.count)) ?? 0
    return green * red * blue
  })

  AocPuzzle.answer(_.sum(part2games))
}
