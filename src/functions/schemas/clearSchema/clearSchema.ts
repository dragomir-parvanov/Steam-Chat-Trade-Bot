export function schemaTest<T>(object, schema: clearSchemaTesting<T>): T {
  const clearObject: object = {};
  for (const key in schema) {
    const res = schema[key](object[key]);
    if (res) {
      clearObject[key as string] = res;
    }
  }
  throw new Error();
}

export type clearSchemaTesting<T> = {
  [i in keyof T]: (property: T[i]) => T[i];
};

export function isBoolean(bool: boolean) {
  if (typeof bool !== "boolean") {
    throw new Error("Not a boolean");
  }
}
