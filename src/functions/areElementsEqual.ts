export default function areElementsEqual(...args: unknown[]): boolean {
  return args.every((v, i, a) => v === a[0]);
}
