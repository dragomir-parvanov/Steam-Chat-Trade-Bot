import ValueOf from "../models/types/ValueOf";

export default function enumMembersToString<ENUM extends Record<any, any>>(enumeration: ENUM): Array<keyof ENUM> {
  const result: string[] = [];
  for (const enumMember in enumeration) {
    const isValueProperty = parseInt(enumMember, 10) >= 0;
    if (isValueProperty) {
      result.push(enumeration[enumMember]);
    }
  }
  return result;
}
/**
 * 2020/5/31 needs tests for this
 * This will get the values in number, even if enum values are strings
 * @param enumeration
 */
export function enumValuesToNumber<ENUM extends Record<any, any>>(enumeration: ENUM): number[] {
  const totalValues = Object.keys(enumeration).length / 2;
  const result = new Array(totalValues).fill(0).map((v, i) => i);
  return result;
}
