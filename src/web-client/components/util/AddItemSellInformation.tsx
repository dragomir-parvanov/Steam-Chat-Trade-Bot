import * as React from "react";
import FormItem from "antd/lib/form/FormItem";
import Form from "antd/lib/form/Form";
import { Input, Switch, Button, Row } from "antd";
import Title from "antd/lib/typography/Title";
import ItemSellInformationModel from "../../../models/models/steam/steam-market/ItemSellInformationModel";
import mainConnect from "../../../shared-network/express-function-router/implementations/mainConnect";

export interface AddItemSellInformationProps {}

export interface AddItemSellInformationState {
  statusMessage: JSX.Element | null;
}

export default class AddItemSellInformation extends React.Component<AddItemSellInformationProps, AddItemSellInformationState> {
  constructor(props: AddItemSellInformationProps) {
    super(props);

    this.state = { statusMessage: null };
  }
  item: Partial<Pick<ItemSellInformationModel, "_id" | "droppable">> = { droppable: false };

  onFinish = () => {
    const { item } = this;
    if (!item || !item._id) {
      return this.setState({ statusMessage: <Title type="danger">market has name is not present</Title> });
    }
    mainConnect.mining.items
      .addItem(item as never)
      .then(() => this.setState({ statusMessage: <Title level={4}>Item is added!</Title> }))
      .catch((error) => this.setState({ statusMessage: <Title type="danger">{error.message}</Title> }));
  };

  public render() {
    return (
      <Form onFinish={this.onFinish}>
        {this.state.statusMessage}
        <Row>
          <FormItem
            rules={[{ required: true, message: "Please input the market hash name of the item" }]}
            label="market hash name"
            name="_id"
            htmlFor="username"
          >
            <Input onChange={({ target }) => (this.item._id = target.value)} />
          </FormItem>
        </Row>
        <Row style={{ padding: 10 }}>
          Is droppable: {"\u00A0"}
          <Switch onChange={(c) => (this.item.droppable = c)} style={{ left: "0px", display: "block" }}></Switch>
        </Row>
        <Row style={{ padding: 10 }}>
          <FormItem>
            <Button type="primary" style={{ marginLeft: "70%" }} htmlType="submit">
              Add item
            </Button>
          </FormItem>
        </Row>
      </Form>
    );
  }
}
