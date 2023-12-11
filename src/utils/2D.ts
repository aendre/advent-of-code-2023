import _ from 'lodash';
import { math } from '../utils/libs.js';

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

export enum RotationDirection {
  ClockWise = 'CLOCKWISE',
  CounterClockWise = 'COUNTERCLOCKWISE',
  NoRotation = 'NOROTATION',
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
  };
  return map[direction];
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
  };
  return map[direction];
}

export function commandToRotationDirection(command:string): RotationDirection {
  switch (command.toLowerCase()) {
    case 'l':
    case 'left':
    case '<':
    case RotationDirection.CounterClockWise.toLowerCase():
      return RotationDirection.CounterClockWise;

    case 'r':
    case '>':
    case 'right':
    case RotationDirection.ClockWise.toLowerCase():
      return RotationDirection.ClockWise;

    default:
      return RotationDirection.NoRotation;
  }
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

type IsUnknown<T> = T extends unknown ? T : never

export class Point2D<T = unknown> {
  private point : Coordinate;

  content : IsUnknown<T> | undefined;

  constructor(p: Coordinate, c?: IsUnknown<T>) {
    this.point = p;
    this.content = c;
  }

  stepOnCartesian(d: string | Direction | undefined) {
    const direction = commandToDirection(`${d}`);
    return this.move(moveOnCartesianCoordinateSystem(direction));
  }

  stepOnCanvas(d: string | Direction | undefined) {
    const direction = commandToDirection(`${d}`);
    return this.move(moveOnCanvas(direction));
  }

  move(moveBy: Coordinate) {
    return new Point2D(math.add(this.point, moveBy), this.content);
  }

  setX(x: number) {
    return new Point2D([x, this.y], this.content);
  }

  setY(y: number) {
    return new Point2D([this.x, y], this.content);
  }

  is(check:Coordinate):boolean {
    return check[0] === this.x && check[1] === this.y;
  }

  isInXRange(min:number, max: number) {
    return this.x > min && this.x < max;
  }

  isInXRangeInclusive(min:number, max: number) {
    return this.x >= min && this.x <= max;
  }

  isInYRange(min:number, max: number) {
    return this.y > min && this.y < max;
  }

  isInYRangeInclusive(min:number, max: number) {
    return this.y >= min && this.y <= max;
  }

  get4Neighbours(): Point2D[] {
    return [
      Direction.Up,
      Direction.Left,
      Direction.Down,
      Direction.Right,
    ].map(direction => this.stepOnCanvas(direction))
  }

  get key() {
    return `${this.x}-${this.y}`;
  }

  get x() {
    return this.point[0];
  }

  get y() {
    return this.point[1];
  }

  get xy() {
    return this.point;
  }

  manhattanDistanceTo(p: Point2D) {
    return Math.abs(this.x - p.x) + Math.abs(this.y - p.y)
  }

  euclideanDistanceTo(p: Point2D) {
    return math.distance(this.xy, p.xy)
  }

  toObject() {
    return {
      x: this.x,
      y: this.y,
    };
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
  };
}

export class Grid {
  width = 0

  height = 0

  points = new Map<string, Point2D>()

  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height
  }

  fromString(input:string) {
    const rows = input.split('\n');
    this.height = rows.length;
    this.width = Math.max(...rows.map(i => i.length)); // Make sure we check the farthest character

    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const p = new Point2D([x, y], rows[y][x]);
        this.points.set(p.key, p)
      }
    }
    return this;
  }

  fromArray(arr:Point2D[], width?: number, height?: number) {
    const map = new Map(arr.map(p => [p.key, p]))
    return this.fromMap(map, width, height);
  }

  fromMap(map:Map<string, Point2D>, width?: number, height?: number) {
    this.points = new Map(map)
    this.width = width ?? this.width;
    this.height = height ?? this.height;
    return this;
  }

  filter(func: (value:Point2D, key:string, coord: Coordinate) => boolean): Grid {
    const g = new Grid()
    const filtered = [...this.points].filter(item => func(item[1], item[0], item[1].xy))
    return g.fromMap(new Map(filtered), this.width, this.height)
  }

  toArray(): Point2D[] {
    return [...this.points].map(v => v[1])
  }

  setWidth(width: number) {
    this.width = width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  column(columnIndex:number) {
    return this.filter((v, k, cord) => cord[0] === columnIndex)
  }

  row(rowIndex:number) {
    return this.filter((v, k, cord) => cord[1] === rowIndex)
  }
}

export function oppositeDirection(direction: Direction) : Direction {
  switch (direction) {
    case Direction.Down: return Direction.Up;
    case Direction.Up: return Direction.Down;
    case Direction.Left: return Direction.Right;
    case Direction.Right: return Direction.Left;
    case Direction.StayStill: return Direction.StayStill;
    case Direction.DiagonalDownLeft: return Direction.DiagonalUpRight;
    case Direction.DiagonalUpRight: return Direction.DiagonalDownLeft;
    case Direction.DiagonalDownRight: return Direction.DiagonalUpLeft;
    case Direction.DiagonalUpLeft: return Direction.DiagonalDownRight;
    default: return direction;
  }
}

export function rotate90deg(direction: Direction, r: RotationDirection | string): Direction {
  const rotation = commandToRotationDirection(r)
  if (rotation === RotationDirection.ClockWise) {
    switch (direction) {
      case Direction.Down: return Direction.Left;
      case Direction.Left: return Direction.Up;
      case Direction.Up: return Direction.Right;
      case Direction.Right: return Direction.Down;
      case Direction.DiagonalDownLeft: return Direction.DiagonalUpLeft;
      case Direction.DiagonalUpLeft: return Direction.DiagonalUpRight;
      case Direction.DiagonalUpRight: return Direction.DiagonalDownRight;
      case Direction.DiagonalDownRight: return Direction.DiagonalDownLeft;
      default: return direction;
    }
  } else if (rotation === RotationDirection.CounterClockWise) {
    switch (direction) {
      case Direction.Down: return Direction.Right;
      case Direction.Right: return Direction.Up;
      case Direction.Up: return Direction.Left;
      case Direction.Left: return Direction.Down;
      case Direction.DiagonalDownLeft: return Direction.DiagonalDownRight;
      case Direction.DiagonalDownRight: return Direction.DiagonalUpRight;
      case Direction.DiagonalUpRight: return Direction.DiagonalUpLeft;
      case Direction.DiagonalUpLeft: return Direction.DiagonalDownLeft;
      default: return direction;
    }
  }
  return direction
}

export function rotate45deg(direction: Direction, r: RotationDirection | string): Direction {
  const rotation = commandToRotationDirection(r)
  if (rotation === RotationDirection.ClockWise) {
    switch (direction) {
      case Direction.Down: return Direction.DiagonalDownLeft;
      case Direction.DiagonalDownLeft: return Direction.Left;
      case Direction.Left: return Direction.DiagonalUpLeft;
      case Direction.DiagonalUpLeft: return Direction.Up;
      case Direction.Up: return Direction.DiagonalUpRight;
      case Direction.DiagonalUpRight: return Direction.Right;
      case Direction.Right: return Direction.DiagonalDownRight;
      case Direction.DiagonalDownRight: return Direction.Down;
      default: return direction;
    }
  } else if (rotation === RotationDirection.CounterClockWise) {
    switch (direction) {
      case Direction.Down: return Direction.DiagonalDownRight;
      case Direction.DiagonalDownRight: return Direction.Right;
      case Direction.Right: return Direction.DiagonalUpRight;
      case Direction.DiagonalUpRight: return Direction.Up;
      case Direction.Up: return Direction.DiagonalUpLeft;
      case Direction.DiagonalUpLeft: return Direction.Left;
      case Direction.Left: return Direction.DiagonalDownLeft;
      case Direction.DiagonalDownLeft: return Direction.Down;
      default: return direction;
    }
  }
  return direction
}
