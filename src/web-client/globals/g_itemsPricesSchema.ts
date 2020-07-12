import ItemSellInformationModel from "../../models/models/steam/steam-market/ItemSellInformationModel";

const g_itemsPricesSchema: g_itemPriceSchemaType = {};

type g_itemPriceSchemaType = Record<string, ItemSellInformationModel>;

export default g_itemsPricesSchema;
