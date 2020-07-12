import Identifiable from "../../data/identifiables/Identifiable";

type EncryptedEntity<T extends Identifiable> = {
  _id: string;
  encryptedString: string;
  iv: string;
};

export default EncryptedEntity;
