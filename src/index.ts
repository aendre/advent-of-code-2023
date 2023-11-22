import * as aoc from './utils/aoc.js';

aoc.startDay();
await aoc.autoDownload();
(await import(`./${aoc.puzzle.dirName}/solve.js`)).default();
aoc.endDay();
