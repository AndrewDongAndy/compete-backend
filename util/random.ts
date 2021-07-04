/**
 * Returns a random integer in the range [low, high].
 * @param low the lower bound
 * @param high the upper bound
 * @returns a random number in the range [low, high]
 */
export const randInt = (low: number, high: number): number => {
  return low + Math.floor(Math.random() * (high - low + 1));
};

export function randChoice<T>(a: Array<T>, take: number): Array<T> {
  const n = a.length;
  const nums = Array(n);
  for (let i = 0; i < n; i++) {
    nums[i] = i;
  }

  // put `take` random distinct indices in the first
  // `take` spots of the array `nums`
  for (let i = 0; i < take; i++) {
    const j = randInt(i, n - 1);
    const tmp = nums[i];
    nums[i] = nums[j];
    nums[j] = tmp;
  }

  const res = Array<T>(take);
  for (let i = 0; i < take; i++) {
    res[i] = a[nums[i]];
  }
  return res;
}
