import * as React from "react";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { Input, Button, Typography } from "antd";
import Title from "antd/lib/typography/Title";
import Axios from "axios";
import o_currentUser from "../../globals/observables/o_currentUser";
import RegisteredUserModel from "../../../models/site/RegisteredUserModel";
import g_history from "../../globals/g_history";

export interface LoginProps {}

export interface LoginState {
  failedMessageLogin: string | null;
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
  }

  state: LoginState = { failedMessageLogin: null };

  onFinish = async (value: any) => {
    await Axios.post("/auth/login", value)
      .then((r) => {
        r.data.registeredOn = new Date(r.data.registeredOn);
        g_history.push("/");
        o_currentUser.next(r.data);
      })
      .catch((error) => this.setState({ failedMessageLogin: error.message }));
  };

  public render() {
    return (
      <div className={"centered"} style={{ top: "30%" }}>
        <div>
          <Title level={2}>Login</Title>
        </div>
        {(() => {
          if (this.state.failedMessageLogin) {
            return (
              <Title level={2} type="danger">
                {this.state.failedMessageLogin}
              </Title>
            );
          }
        })()}
        <Form {...layout} onFinish={this.onFinish}>
          <FormItem rules={[{ required: true, message: "Please input your username" }]} label="username" name="_id" htmlFor="username">
            <Input />
          </FormItem>
          <FormItem rules={[{ required: true, message: "Please input your password" }]} label="password" name="password" htmlFor="password">
            <Input.Password />
          </FormItem>
          <FormItem {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
