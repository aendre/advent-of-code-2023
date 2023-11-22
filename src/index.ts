import * as aoc from './utils/aoc.js';

aoc.startDay()
await aoc.autoDownload(aoc.puzzle.day);
(await import(`./day-${aoc.puzzle.dday}/solve.js`)).default();
aoc.endDay()
