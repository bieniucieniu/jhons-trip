export default function cleanupObject(obj: {
  [k: string]: string | number | boolean | undefined;
}): { [k: string]: string } {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != undefined)
      .map(([k, v]) => [k, String(v)]),
  ) as { [k: string]: string };
}
