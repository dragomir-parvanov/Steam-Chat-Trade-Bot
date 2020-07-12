import { ECurrency } from "../enums/ECurrency";

type CurrencyRecord<T> = { [i in keyof typeof ECurrency]: T };

export default CurrencyRecord;
