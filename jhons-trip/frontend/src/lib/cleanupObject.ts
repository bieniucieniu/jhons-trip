export default function cleanupObject(obj: {
  [k: string]: string | undefined;
}): { [k: string]: string } {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as { [k: string]: string };
}
