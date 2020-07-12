import * as React from "react";
import { SteamId64 } from "../../../../models/types/SteamId64";
import ParsedItemWithSellInformationModel from "../../../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import { Button, Input, Modal } from "antd";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import getItemsPriceSchema from "../../../functions/chats/initial-loading/getItemsPriceSchema";
import createItemWithSellInformationFromSchema from "../../../factories/createItemWithSellInformationFromSchema";
import TradeWindow from "../../common/TradeWindow";
import CreateTradeOfferModel from "../../../../models/models/steam/steam-offers/CreateTradeOfferModel";
import Title from "antd/lib/typography/Title";
import SendTradeOfferModel from "../../../../models/models/steam/steam-offers/SendTradeOfferModel";
import getPartnerNotSpecialItems from "../../../../steam-client/functions/offers/getPartnerNotSpecialItems";
import tradeOfferModalDefaultProps from "../../../styles/jsx/tradeOfferModalDefaultProps";
import LogError from "../../../../classes/errors/base/LogError";

export interface SendTradeOfferFromClientProps {
  clientId: SteamId64;
}

export interface SendTradeOfferFromClientState {
  details: CreateTradeOfferModel | null;
  isTradeWindowOpened: boolean;
  statusMessage: JSX.Element | null;
}

export default class SendTradeOfferFromClient extends React.Component<SendTradeOfferFromClientProps, SendTradeOfferFromClientState> {
  constructor(props: SendTradeOfferFromClientProps) {
    super(props);

    this.state = { details: null, isTradeWindowOpened: false, statusMessage: null };
  }
  currentTradeOfferLink: string | null = null;
  handleOpenTradeWindow = async ({ tradeOfferLink }: { tradeOfferLink: string }) => {
    const { clientId } = this.props;
    const details = await mainConnect.items.offers.getTradeOfferDetailsFromTradeLink(clientId, tradeOfferLink).catch((error) => {
      this.setState({ statusMessage: <Title type="danger">{error.message}</Title> });
      throw new Error(error.message);
    });
    this.currentTradeOfferLink = tradeOfferLink;
    this.setState({ details }, () => this.setState({ isTradeWindowOpened: true }));
    // const schema = await getItemsPriceSchema(new Set(inventory.map((i) => i.marketHashName)));
    // const inventoryWithSellInformation = inventory.map((i) => createItemWithSellInformationFromSchema(schema[i.marketHashName], i));
    // this.setState({ clientItems: inventoryWithSellInformation }, () => {
    //   this.setState({ isTradeWindowOpened: true });
    // });
  };
  handleSendOffer = (request: SendTradeOfferModel) => {
    if (!this.currentTradeOfferLink) {
      throw new LogError("current trade offer link is undefined, but it should be set on handleFinish callback from form");
    }
    const { details } = this.state;
    if (!details) {
      return;
    }
    const assetIds = request.partner.exactItemAssetIds;
    assetIds.push(...getPartnerNotSpecialItems(request.partner.notSpecialItems, details.partnerItems, details.clientId, details.partnerId));
    const newRequest: SendTradeOfferModel = {
      client: request.client,
      partner: { exactItemAssetIds: assetIds, notSpecialItems: [] },
      clientId: request.clientId,
      partnerId: request.partnerId,
      tradeOfferLink: this.currentTradeOfferLink,
    };
    this.setState({ isTradeWindowOpened: false });
    mainConnect.items.offers.sendOfferFromTradeLink(newRequest);
  };
  public render() {
    const { clientId } = this.props;
    const { details, statusMessage, isTradeWindowOpened } = this.state;

    return (
      <React.Fragment>
        {(() => {
          if (!details) {
            return null;
          }
          const { clientId, clientItems, partnerId, partnerItems } = details;
          return (
            <Modal visible={isTradeWindowOpened} {...tradeOfferModalDefaultProps} onCancel={() => this.setState({ isTradeWindowOpened: false })}>
              <TradeWindow
                clientId={clientId}
                partnerId={partnerId}
                clientItems={clientItems}
                partnerItems={partnerItems}
                onFinish={this.handleSendOffer}
              ></TradeWindow>
            </Modal>
          );
        })()}
        {statusMessage}
        <Form onFinish={this.handleOpenTradeWindow as never}>
          <FormItem required label="Trade offer link" htmlFor="tradeOfferLink" name="tradeOfferLink">
            <Input required />
          </FormItem>

          <FormItem>
            <Button style={{ right: 0, position: "absolute" }} type="primary" htmlType="submit">
              Open trade window
            </Button>
          </FormItem>
        </Form>
      </React.Fragment>
    );
  }
}
