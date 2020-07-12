import * as React from "react";
import Form from "antd/lib/form/Form";
import { g_isAdmin } from "../../globals/g_isAdmin";
import FormItem from "antd/lib/form/FormItem";
import { Input, Switch, Typography, Select, Button } from "antd";
import RegisteredUserModel from "../../../models/site/RegisteredUserModel";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import ERegisteredUserClaim from "../../../models/site/enums/ERegisteredUserClaim";
import enumMembersToString from "../../../functions/enumFunctions";

import Axios from "axios";
import Title from "antd/lib/typography/Title";

export interface UserInformationProps {
  user: Omit<RegisteredUserModel, "password"> | null;
  onEditedUser?: (user: RegisteredUserModel) => void;
}

export interface UserInformationState {
  allowedToEdit: boolean;

  editMessage: JSX.Element | null;
}

export default class UserInformation extends React.Component<UserInformationProps, UserInformationState> {
  constructor(props: UserInformationProps) {
    super(props);
    const currentKey = new Date().getTime();
    const editMessage = null;
    this.state = { allowedToEdit: g_isAdmin, editMessage };
    this.handleUserPropCopy();
  }
  handleUserPropCopy() {
    const { user } = this.props;

    if (user) {
      this.editedUser = { ...user };
      this.editedUser.claims = [...user.claims];
    } else {
      console.log("again null");
    }
  }
  editedUser: Partial<Omit<RegisteredUserModel, "password">> = {};

  handleEdit = () => {
    const cachedUser = { ...this.editedUser };
    delete cachedUser["isIn"];
    Axios.patch("auth/user", cachedUser)
      .then(() => {
        this.setState({ editMessage: <Title level={4}>Edit is saved!</Title> });
        this.props.onEditedUser && this.props.onEditedUser({ ...cachedUser } as never);
        console.log("sent user");
      })
      .catch((error) =>
        this.setState({
          editMessage: (
            <Title type="danger" level={4}>
              Error saving edit: {error.message}
            </Title>
          ),
        })
      )
      .finally(() => {
        this.editedUser = cachedUser;
      });
  };

  componentDidUpdate() {
    this.handleUserPropCopy();
  }

  public render() {
    const user = this.props.user;
    if (!user) {
      return <div>Not logged in</div>;
    }
    const { allowedToEdit } = this.state;

    return (
      <div>
        {this.state.editMessage}
        <Title level={4} style={{ right: "50%", transform: "translate(-50 %)" }}>
          User: {user._id}
        </Title>
        <Form>
          <FormItem label="phone number" htmlFor="phoneNumber">
            <Input
              onChange={(c) => {
                this.editedUser.phoneNumber = c.target.value;
              }}
              defaultValue={user.phoneNumber}
              disabled={!allowedToEdit}
            ></Input>
          </FormItem>
        </Form>
        Registered on {user.registeredOn.toLocaleDateString()}
        <br></br>
        <Typography>Claims</Typography>
        <Select
          disabled={!allowedToEdit}
          mode="multiple"
          options={enumMembersToString(ERegisteredUserClaim).map((c) => {
            return { value: c };
          })}
          style={{ width: "100%", maxWidth: "100%" }}
          defaultValue={user.claims.map((c) => ERegisteredUserClaim[c])}
          onChange={(claims) => (this.editedUser.claims = claims.map((c) => ERegisteredUserClaim[c]))}
        ></Select>
        <br></br>
        <Typography>Is active</Typography>
        <Switch
          disabled={!allowedToEdit}
          onChange={(b) => (this.editedUser.isActive = b)}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={user.isActive}
        />
        <br></br>
        {(() => {
          if (allowedToEdit) {
            return (
              <div>
                <Button onClick={this.handleEdit} type="primary" style={{ marginTop: "3vh" }}>
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    this.forceUpdate();
                  }}
                  type="default"
                  style={{ marginTop: "3vh", marginInlineStart: "3vh" }}
                >
                  Reset
                </Button>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
