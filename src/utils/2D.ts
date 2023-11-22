import math from '../utils/math.js'

export type Coordinate = [number, number];

export enum Direction {
  Left = 'LEFT',
  Right = 'RIGHT',
  Up = 'UP',
  Down = 'DOWN',
  DiagonalUpLeft = 'UP_LEFT',
  DiagonalUpRight = 'UP_RIGHT',
  DiagonalDownLeft = 'DOWN_LEFT',
  DiagonalDownRight = 'DOWN_RIGHT',
  StayStill = 'STAY_STILL',
}

export function moveOnCartesianCoordinateSystem(direction: Direction) {
  const map: Record<Direction, Coordinate> = {
    [Direction.Left]: [-1, 0],
    [Direction.Right]: [1, 0],
    [Direction.Up]: [0, 1],
    [Direction.Down]: [0, -1],
    [Direction.DiagonalUpLeft]: [-1, 1],
    [Direction.DiagonalUpRight]: [1, 1],
    [Direction.DiagonalDownLeft]: [-1, -1],
    [Direction.DiagonalDownRight]: [1, -1],
    [Direction.StayStill]: [0, 0],
  }
  return map[direction]
}

export function moveOnCanvas(direction: Direction) {
  const map: Record<Direction, Coordinate> = {
    [Direction.Left]: [-1, 0],
    [Direction.Right]: [1, 0],
    [Direction.Up]: [0, -1],
    [Direction.Down]: [0, 1],
    [Direction.DiagonalUpLeft]: [-1, -1],
    [Direction.DiagonalUpRight]: [1, -1],
    [Direction.DiagonalDownLeft]: [-1, 1],
    [Direction.DiagonalDownRight]: [1, 1],
    [Direction.StayStill]: [0, 0],
  }
  return map[direction]
}

export function commandToDirection(command:string): Direction {
  switch (command.toLowerCase()) {
    case 'u':
    case 'up':
    case '^':
    case 'n':
    case 'north':
      return Direction.Up;

    case 'l':
    case 'left':
    case '<':
    case 'w':
    case 'west':
      return Direction.Left;

    case 'r':
    case 'right':
    case '>':
    case 'e':
    case 'east':
      return Direction.Right;

    case 'd':
    case 'down':
    case 'v':
    case 's':
    case 'south':
      return Direction.Down;

    // Diagonal direction
    case 'ne':
    case 'northeast':
    case 'ur':
    case 'upright':
      return Direction.DiagonalUpRight;
    case 'nw':
    case 'northwest':
    case 'ul':
    case 'upleft':
      return Direction.DiagonalUpLeft;
    case 'se':
    case 'southeast':
    case 'dr':
    case 'downright':
      return Direction.DiagonalDownRight;
    case 'sw':
    case 'southwest':
    case 'dl':
    case 'downleft':
      return Direction.DiagonalDownLeft;

    default:
      return Direction.StayStill;
  }
}

type IsUnkown<T> = T extends unknown ? T : never

export class Point2D<T = unknown> {
  private point : Coordinate

  content : IsUnkown<T> | undefined

  constructor(p: Coordinate, c?: IsUnkown<T>) {
    this.point = p
    this.content = c
  }

  stepOnCartesian(d: string | Direction | undefined) {
    const direction = commandToDirection(`${d}`)
    return this.move(moveOnCartesianCoordinateSystem(direction))
  }

  stepOnCanvas(d: string | Direction | undefined) {
    const direction = commandToDirection(`${d}`)
    return this.move(moveOnCanvas(direction))
  }

  move(moveBy: Coordinate) {
    return new Point2D(math.add(this.point, moveBy), this.content)
  }

  setX(x: number) {
    return new Point2D([x, this.y], this.content)
  }

  setY(y: number) {
    return new Point2D([this.x, y], this.content)
  }

  is(check:Coordinate):boolean {
    return check[0] === this.x && check[1] === this.y
  }

  isInXRange(min:number, max: number) {
    return this.x > min && this.x < max
  }

  isInXRangeInclusive(min:number, max: number) {
    return this.x >= min && this.x <= max
  }

  isInYRange(min:number, max: number) {
    return this.y > min && this.y < max
  }

  isInYRangeInclusive(min:number, max: number) {
    return this.y >= min && this.y <= max
  }

  get key() {
    return `${this.x}-${this.y}`
  }

  get x() {
    return this.point[0]
  }

  get y() {
    return this.point[1]
  }

  get xy() {
    return this.point
  }

  toObject() {
    return {
      x: this.x,
      y: this.y,
    }
  }
}

export function boundingBox(points: Point2D[]) {
  return {
    x: {
      min: Math.min(...points.map(c => c.x)),
      max: Math.max(...points.map(c => c.x)),
    },
    y: {
      min: Math.min(...points.map(c => c.y)),
      max: Math.max(...points.map(c => c.y)),
    },
  }
}
