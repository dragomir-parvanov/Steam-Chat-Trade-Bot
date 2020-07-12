import * as React from "react";
import Modal from "antd/lib/modal/Modal";
import { Button, Input, Space } from "antd";
import FormItem from "antd/lib/form/FormItem";
import g_clientActiveChats from "../../../globals/g_clientActiveChats";
import ClientAndPartnerIdentfiables from "../../../../models/interfaces/ClientAndPartnerIdentfiables";
import createDoubleIdentification from "../../../../functions/doubleIdentification";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";

export interface CloseChatModalProps extends ClientAndPartnerIdentfiables {
  visible?: boolean;
  onCancel: () => void;
}

export interface CloseChatModalState {
  visible?: boolean;
  rescanAfterDaysInput: string;
}

export default class CloseChatModal extends React.Component<CloseChatModalProps, CloseChatModalState> {
  constructor(props: CloseChatModalProps) {
    super(props);

    this.state = { rescanAfterDaysInput: "1", visible: props.visible ?? false };
  }
  // component did update doesn't set state correctly, when it comes down to booleans, react 16.3.x
  componentWillReceiveProps = (props: CloseChatModalProps) => {
    this.setState(({ visible }) => {
      if (visible !== props.visible) {
        return { visible: props.visible };
      }
      return null;
    });
  };
  handleRescanAfterDays = () => {
    this.setState({ visible: false });
    this.props.onCancel();
    const { rescanAfterDaysInput } = this.state;
    const { clientId, partnerId } = this.props;
    const id = createDoubleIdentification(clientId, partnerId);
    const chat = g_clientActiveChats[id];

    chat.update((c) => ({ ...c, isActive: false }));

    mainConnect.chats.rescanFriend(clientId, partnerId, parseInt(rescanAfterDaysInput));
  };
  footer: JSX.Element = (
    <Space>
      <Button disabled style={{ background: "red" }}>
        Remove friend
      </Button>
      <Button disabled>Remove and readd friend</Button>
      <Button disabled>Remove and rescan friend</Button>
      <Button autoFocus={true} type="primary" onClick={this.handleRescanAfterDays}>
        Rescan
      </Button>
    </Space>
  );

  public render() {
    const { rescanAfterDaysInput, visible } = this.state;
    const { clientId, partnerId, onCancel } = this.props;
    const id = createDoubleIdentification(clientId, partnerId);
    return (
      <Modal key={`${id}-close-chat-modal`} width="40%" visible={this.state.visible} footer={this.footer} onCancel={onCancel}>
        <FormItem label="Rescan after days" rules={[{ type: "number" }]}>
          <Input value={rescanAfterDaysInput} onChange={(v) => this.setState({ rescanAfterDaysInput: v.currentTarget.value })} />
        </FormItem>
      </Modal>
    );
  }
}
