import * as React from "react";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { Input, Button, Typography } from "antd";
import Title from "antd/lib/typography/Title";
import Axios from "axios";

export interface RegisterProps {}

export interface RegisterState {
  registerMessage: JSX.Element | null;
}

const layout = {
  labelCol: {
    span: 10,
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

export default class Register extends React.Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props);

    this.state = { registerMessage: null };
  }

  onFinish = (value: any) => {
    if (value.password !== value.confirmPassword) {
      return this.setState({ registerMessage: <Title>Passwords doesn't match</Title> });
    }
    Axios.post("auth/register", value)
      .then((r) => {
        this.setState({
          registerMessage: <Typography>Registration successful</Typography>,
        });
      })
      .catch((error) => {
        this.setState({ registerMessage: <Title type="danger">Error registering: {error.data}</Title> });
      });
  };
  public render() {
    return (
      <div className="centered" style={{ top: "30%" }}>
        <Title level={4}>Register</Title>
        {this.state.registerMessage}
        <Form {...layout} onFinish={this.onFinish}>
          <FormItem rules={[{ required: true, message: "Please input your username" }]} label="username" name="_id" htmlFor="username">
            <Input />
          </FormItem>
          <FormItem rules={[{ required: true, message: "Please input your password" }]} label="password" name="password" htmlFor="password">
            <Input.Password />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: "Please confirm your password" }]}
            label="confirm"
            name="confirmPassword"
            htmlFor="confirmPassword"
          >
            <Input.Password />
          </FormItem>
          <FormItem
            rules={[{ required: true, message: "Please input your phone number" }]}
            label="phone number"
            name="phoneNumber"
            htmlFor="phoneNumber"
          >
            <Input />
          </FormItem>
          <FormItem {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
