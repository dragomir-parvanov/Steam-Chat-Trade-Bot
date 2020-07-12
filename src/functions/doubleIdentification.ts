export default function createDoubleIdentification(id1: string, id2: string) {
  return id1 + DOUBLE_IDENTIFICATION_SEPARATOR + id2;
}
export function destroyDoubleIdentification(id: string): [string, string] {
  return id.split(DOUBLE_IDENTIFICATION_SEPARATOR) as never;
}

export const DOUBLE_IDENTIFICATION_SEPARATOR = "-";
