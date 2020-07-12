import * as React from "react";
import Modal from "antd/lib/modal/Modal";
import FormItem from "antd/lib/form/FormItem";
import MarketSellOrderModel from "../../../../models/models/steam/steam-market/MarketSellOrderModel";
import { Input, Switch, Form, Button, InputNumber } from "antd";
import { FormProps } from "antd/lib/form";

export interface MarketSellOrderModalCommonProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (order: MarketSellOrderModel) => void;
}
export interface MarketSellOrderModalProps extends MarketSellOrderModalCommonProps {
  order: MarketSellOrderModel;
}

export interface MarketSellOrderModalPropsCreateMode extends MarketSellOrderModalCommonProps {
  createMode: true;
}

export interface IMarketSellOrderModalState {
  visible: boolean;
  editedOrder: MarketSellOrderModel;
}

export default class MarketSellOrderModal extends React.Component<
  MarketSellOrderModalProps | MarketSellOrderModalPropsCreateMode,
  IMarketSellOrderModalState
> {
  constructor(props: MarketSellOrderModalProps) {
    super(props);

    this.state = {
      visible: props.visible,
      editedOrder: props.order ? props.order : { _id: null as any, usd: null as any, rub: null as any, eur: null as any, isActive: false },
    };
  }
  componentWillReceiveProps = (props: MarketSellOrderModalProps) => {
    if (props.visible !== this.state.visible) {
      this.setState({ visible: props.visible });
    }
    if (props.order && props.order !== this.state.editedOrder) {
      this.setState({ editedOrder: props.order });
    }
  };
  public render() {
    const { visible, editedOrder } = this.state;
    const { onCancel, onFinish } = this.props;
    const createMode = this.props["createMode"];
    const fields: FormProps["fields"] = Object.entries(editedOrder).map(([name, value]) => ({ name, value }));
    return (
      <Modal destroyOnClose visible={visible} onCancel={onCancel}>
        <Form fields={fields} onFinish={(r: any) => onFinish(r)}>
          <FormItem rules={[{ required: true }]} name="_id" label="Market Hash Name">
            <Input disabled={!createMode} />
          </FormItem>
          <FormItem rules={[{ required: true, type: "number" }]} name="eur" label="EUR Price">
            <InputNumber />
          </FormItem>
          <FormItem rules={[{ required: true, type: "number" }]} name="usd" label="USD Price">
            <InputNumber />
          </FormItem>
          <FormItem rules={[{ required: true, type: "number" }]} name="rub" label="RUB Price">
            <InputNumber />
          </FormItem>
          <FormItem name="isActive" label="Is Active" valuePropName="checked">
            <Switch />
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              {createMode ? "Add" : "Edit"}
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
