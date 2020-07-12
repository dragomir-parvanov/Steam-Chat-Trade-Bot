import { ColumnsType, ColumnType } from "antd/lib/table";
import React from "react";
import lodash from "lodash";
export default function columnGenerator<T>(data: T): ColumnsType<T> {
  const result: ColumnsType<T> = [];
  for (const key in data) {
    const column: ColumnType<T> = {
      key,
      dataIndex: key,
      title: lodash.startCase(key),
    };

    const value = data[key];
    const type = typeof value;
    if (value instanceof Date) {
      column.render = (date: Date) => <a>{date.toLocaleDateString()}</a>;
    } else if (type === "boolean") {
      column.render = (bool: boolean) => <a>{bool ? "Yes" : "No"}</a>;
    } else if (type !== "object" && !Array.isArray(value)) {
      column.render = (text: any) => <a>{text}</a>;
    } else {
      continue;
    }

    if (typeof value === "boolean" || typeof value === "number") {
      const comparer = ((a, b) => a[key] - b[key]) as any;
      column.sorter = {
        compare: comparer,
        multiple: 0,
      };
    } else if (typeof value === "string") {
      const comparer = ((a: string, b: string) => (a > b ? -1 : 1)) as any;
      column.sorter = {
        compare: comparer,
        multiple: 0,
      };
    } else {
      // some object that we cannot render
    }

    result.push(column);
  }

  return result;
}
