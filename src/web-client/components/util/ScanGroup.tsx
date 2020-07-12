import * as React from "react";
import FormItem from "antd/lib/form/FormItem";
import { Input, Form, Button, Switch } from "antd";
import scanGroupRequestValidator from "../../../shared-network/validators/scanGroupRequestValidator";
import ScanGroupRequestModel from "../../../shared-network/models/web/requests/ScanGroupRequestModel";
import Title from "antd/lib/typography/Title";
import Axios from "axios";
import mainConnect from "../../../shared-network/express-function-router/implementations/mainConnect";

export interface ScanGroupProps {}

export interface ScanGroupState {
  statusMessage: JSX.Element | null;
}

const pageInputStyle: React.CSSProperties = { width: "100px" };

export default class ScanGroup extends React.Component<ScanGroupProps, ScanGroupState> {
  constructor(props: ScanGroupProps) {
    super(props);

    this.state = { statusMessage: null };
  }

  onScanButtonClick = () => {
    const isValid = scanGroupRequestValidator(this.groupRequest, (message) => {
      this.setState({ statusMessage: <Title type="danger">{message}</Title> });
    });
    if (isValid) {
      const { url, isCSGOGroup, fromPage, toPage } = this.groupRequest as ScanGroupRequestModel;
      mainConnect.mining.profiles.scanGroup(url, isCSGOGroup, fromPage, toPage);
    }
  };

  groupRequest: Partial<ScanGroupRequestModel> = {};

  public render() {
    return (
      <Form onFinish={this.onScanButtonClick}>
        {this.state.statusMessage}
        <FormItem label="Group url">
          <Input onChange={({ target }) => (this.groupRequest.url = target.value)}></Input>
        </FormItem>
        <FormItem rules={[{ required: true, min: 0 }]} label="From page">
          <Input onChange={({ target }) => (this.groupRequest.fromPage = parseInt(target.value))} type="number" style={pageInputStyle}></Input>
        </FormItem>
        <FormItem rules={[{ required: true, min: 0 }]} label="To page">
          <Input onChange={({ target }) => (this.groupRequest.toPage = parseInt(target.value))} type="number" style={pageInputStyle}></Input>
        </FormItem>
        <FormItem>
          <FormItem>
            Is CSGO group:
            <br></br>
            <Switch onChange={(v) => (this.groupRequest.isCSGOGroup = v)}></Switch>
          </FormItem>
          <Button type="primary" htmlType="submit" className="horizontal-center">
            Scan group
          </Button>
        </FormItem>
      </Form>
    );
  }
}
