import { Modal, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import Axios from "axios";
import * as React from "react";
import ERegisteredUserClaim from "../../../models/site/enums/ERegisteredUserClaim";
import RegisteredUserModel from "../../../models/site/RegisteredUserModel";
import d_userHasClaim from "../../functions/decorators/d_userHasClaim";
import UserInformation from "../common/UserInformation";

export interface UserManagementProps {}

export interface UserManagementState {
  users: RegisteredUserModel[];
  currentUserForEdit: RegisteredUserModel | null;
  loading: boolean;
}

const columns: ColumnsType<RegisteredUserModel> = [
  {
    title: "Username",
    dataIndex: "_id",
    key: "_id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Registered on",
    dataIndex: "registeredOn",
    key: "registeredOn",
    render: (date: Date) => <a>{date.toLocaleDateString()}</a>,
  },
  {
    title: "Is active",
    dataIndex: "isActive",
    key: "isActive",
    render: (active: boolean) => <a>{active ? "Yes" : "No"}</a>,
  },
  {
    title: "Claims",
    dataIndex: "claims",
    key: "claims",
    render: (claims: ERegisteredUserClaim[]) => <a>{claims.map((c) => ERegisteredUserClaim[c]).join(", ")}</a>,
  },
];

@d_userHasClaim(ERegisteredUserClaim.Admin)
export default class UsersManagement extends React.Component<UserManagementProps, UserManagementState> {
  constructor(props: UserManagementProps) {
    super(props);

    this.state = { users: [], currentUserForEdit: null, loading: true };
  }

  componentDidMount() {
    Axios.get<RegisteredUserModel[]>("/auth/users").then((r) => {
      const body = r.data;
      body.forEach((u) => (u.registeredOn = new Date(u.registeredOn)));
      this.setState({ users: body, loading: false });
    });
  }

  public render() {
    const visible = this.state.currentUserForEdit ? true : false;
    return (
      <React.Fragment>
        <Modal okButtonProps={{ style: { display: "none" } }} visible={visible} onCancel={() => this.setState({ currentUserForEdit: null })}>
          <UserInformation
            onEditedUser={(user) =>
              this.setState(({ users }) => {
                const index = users.findIndex((u) => u._id === user._id);
                const newState = [...users];

                newState[index] = user;
                this.setState({ users: newState });
              })
            }
            user={this.state.currentUserForEdit}
          />
        </Modal>
        <Table
          loading={this.state.loading}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                this.setState({ currentUserForEdit: record });
              },
            };
          }}
          columns={columns}
          dataSource={this.state.users}
        ></Table>
      </React.Fragment>
    );
  }
}
