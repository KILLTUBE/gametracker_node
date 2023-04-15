/**
 * @returns {number}
 */
export function now() {
  return new Date().valueOf();
}
/**
 * @returns {number}
 */
export function time() { // this is php-like for the database
  return Math.round( now() / 1000 );
}
