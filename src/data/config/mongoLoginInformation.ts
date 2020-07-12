export default interface MongoLoginInformation {
  connectUrl: string;
}

export const mongoLoginInformation: MongoLoginInformation = {
  connectUrl:
    process.env.NODE_ENV === "production"
      ? `mongodb://Drago:somePassword@localhost:27017/?authMechanism=DEFAULT&authSource=admin`
      : "mongodb://localhost:27017/programata",
};
