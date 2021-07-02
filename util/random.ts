/**
 * Returns a random integer in the range [low, high].
 * @param low the lower bound
 * @param high the upper bound
 * @returns a random number in the range [low, high]
 */
export const randInt = (low: number, high: number): number => {
  return low + Math.floor(Math.random() * (high - low + 1));
};
