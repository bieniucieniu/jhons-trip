export async function asyncFilter<T>(
  arr: T[],
  predicate: (value: T, index?: number) => Promise<boolean>,
) {
  const results = await Promise.allSettled(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
}

export function cleanupObject(obj: {
  [k: string]: string | number | boolean | undefined;
}): { [k: string]: string } {
  console.log(obj);
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != undefined)
      .map(([k, v]) => [k, String(v)]),
  ) as { [k: string]: string };
}
