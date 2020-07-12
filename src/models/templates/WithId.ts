import Identifiable from "../../data/identifiables/Identifiable";
import WithKey from "./WithKey";

type WithId<T, Id = string> = WithKey<T, keyof Identifiable<Id>>;

export default WithId;
