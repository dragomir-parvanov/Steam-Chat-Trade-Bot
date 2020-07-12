type WithKey<T, Key extends string, KeyValue = any> = T extends boolean | number | string | ArrayLike<any> | Set<any>
  ? { [i in Key]: KeyValue } & { data: T }
  : T & { [i in Key]: KeyValue };

export default WithKey;
