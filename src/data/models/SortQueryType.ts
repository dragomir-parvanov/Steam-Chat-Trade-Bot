import OneKey from "../../models/types/OneKey";

type SortQueryType<Entity extends Record<any, any>> = {
  [i in keyof Entity]?: -1 | 1;
};

export default SortQueryType;
