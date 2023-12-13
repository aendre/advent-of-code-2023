import _ from 'lodash'
import { create, all } from 'mathjs'

/**
 * Re-export lodash
 */
export { _ };

/**
 * Export math as an ES6 module
 *
 * Read more: https://mathjs.org/docs/getting_started.html#es-modules
 */
const mathConfig = { }
export const math = create(all, mathConfig)

/**
 *  Match tokens from string
 *  Example:
 *    const [subject, count] = patternMatch(line, '$str was striked $int times')
 */
export function patternMatch(str: string, matcher:string) {
  // https://digitalfortress.tech/tips/top-15-commonly-used-regex/
  // https://javascript.plainenglish.io/the-7-most-commonly-used-regular-expressions-in-javascript-bb4e98288ca6
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const regExpMap:Record<string, { regexp:string, initializer:(input:string) => any }> = {
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
  };

  const tokenMatcher = `${Object.keys(regExpMap).map(_.escapeRegExp).map(c => `(${c})`).join('|')}`;

  const tokens = matcher.match(new RegExp(tokenMatcher, 'g'));
  if (tokens === null) {
    throw new Error('No tokens were found in the input string');
  }

  let inputMatcherRegExp = matcher;
  Object.keys(regExpMap).forEach(key => {
    inputMatcherRegExp = inputMatcherRegExp.replace(new RegExp(_.escapeRegExp(key), 'g'), regExpMap[key].regexp);
  });

  let matches = str.match(new RegExp(inputMatcherRegExp));

  if (matches === null) {
    return tokens.map(t => null);
  }
  // Drop the full match
  matches = matches.slice(1) as RegExpMatchArray;

  // Safe check
  if (matches.length !== tokens.length || matches.length < 1) {
    return tokens.map(t => null);
  }

  // Return inputs in the matching type
  return matches.map((match, index) => regExpMap[tokens[index]].initializer(match));
}

export function memoize<Args extends unknown[], Result>(func: (...args: Args) => Result): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);
    if (stored.has(k)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return stored.get(k)!;
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}
