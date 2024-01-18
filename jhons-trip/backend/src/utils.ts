async function asyncFilter<T>(
  arr: T[],
  predicate: (value: T, index?: number) => Promise<boolean>,
) {
  const results = await Promise.allSettled(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
}
