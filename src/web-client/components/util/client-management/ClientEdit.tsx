import * as React from "react";

import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { Input, Button, Select, Switch } from "antd";
import WorkerClientModel from "../../../../models/WorkerClientModel";
import AtLeast from "../../../../models/types/AtLeast";
import SteamClientModel from "../../../../models/models/steam/steam-profiles/SteamClientModel";
import d_userHasClaim from "../../../functions/decorators/d_userHasClaim";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import LogError from "../../../../classes/errors/base/LogError";
import { ECurrency } from "../../../../models/enums/ECurrency";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import SteamClientCredentialsModel from "../../../../models/models/steam/steam-profiles/SteamClientCredentialsModel";
import enumMembersToString from "../../../../functions/enumFunctions";
import o_currentUser from "../../../globals/observables/o_currentUser";
import Title from "antd/lib/typography/Title";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export interface ClientEditProps {
  client?: WorkerClientModel;
  createMode?: boolean;
  onClient?: (client: WorkerClientModel) => void;
  onClientUpdate?: (update: AtLeast<WorkerClientModel, "_id">) => void;
}

export interface ClientEditState {
  editedClient: Partial<WorkerClientModel>;
  step: 1 | 2;
  statusMessage: JSX.Element | null;
  isClientRunning: boolean;
}

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 16,
  },
};
const switchSettings = { checkedChildren: <CheckOutlined />, unCheckedChildren: <CloseOutlined /> };

function createSteamClientModel(client: WorkerClientModel): SteamClientModel {
  const copy = { ...client };
  delete copy.friendListCount;
  delete copy.isRunning;
  delete copy.maxFriendListCount;
  delete copy.hasCrashed;
  client.level = parseInt(client.level as never);
  client.tier = parseInt(client.tier as never);
  copy["friends"] = {};

  return copy as never;
}

@d_userHasClaim(ERegisteredUserClaim.ClientsManagement)
export default class ClientEdit extends React.Component<ClientEditProps, ClientEditState> {
  constructor(props: ClientEditProps) {
    super(props);

    this.state = {
      editedClient: { ...this.props.client },
      step: 1,
      statusMessage: null,
      isClientRunning: false,
    };
  }

  setErrorStatusMessage = (message: string) => {
    this.setState({ statusMessage: <Title type="danger">{message}</Title> });
  };

  setStatusMessage = (message: string) => {
    this.setState({ statusMessage: <Title level={4}>{message}</Title> });
  };

  handleFinishFirstStep = (r: any) => {
    console.log(r);
    let client = this.props.client;

    const keys = ["isAllowedToScan", "isAllowedToAddFriends", "isAllowedToRun", "isRunning"];
    const clientForm = r as WorkerClientModel;
    if (this.props.createMode) {
      for (const key of keys.filter((k) => k !== "isRunning")) {
        if (clientForm[key] === undefined) {
          clientForm[key] = false;
        }
      }
    } else {
      if (!client) {
        throw new LogError("client is undefined");
      }
      for (const key of keys) {
        if (clientForm[key] === undefined) {
          clientForm[key] = client[key];
        }
      }
      if (clientForm.walletCurrency === undefined) {
        clientForm.walletCurrency = client.walletCurrency;
      }
    }

    // because form is returning string, but we need number
    clientForm.walletCurrency = parseInt(ECurrency[clientForm.walletCurrency]);
    this.newClient = clientForm;

    if (!this.props.createMode) {
      mainConnect.clients
        .updateClient(createSteamClientModel(clientForm))
        .then((r) => {
          this.setState({ statusMessage: <Title level={4}>Successfully edited steam client</Title> });
          this.props.onClient && this.props.onClient(clientForm);
        })
        .catch((error) =>
          this.setState({
            statusMessage: (
              <Title type="danger" level={4}>
                {error.message}
              </Title>
            ),
          })
        );
    } else {
      this.setState({ step: 2 });
    }

    console.log(clientForm);
  };
  handleFinishSecondStep = (r: any) => {
    if (!this.newClient) {
      throw new Error("new client is null");
    }

    const credentials = r as SteamClientCredentialsModel;
    credentials._id = this.newClient._id;

    console.log(credentials);
    if (this.props.createMode) {
      const client = createSteamClientModel(this.newClient);

      mainConnect.clients
        .addClient(client, credentials)
        .then((r) => {
          if (!this.newClient) {
            throw new Error("user is null");
          }
          this.props.onClient && this.props.onClient(this.newClient);
          this.setState({ statusMessage: <Title level={4}>Successfully added steam client</Title> });
        })
        .catch((error) =>
          this.setState({
            statusMessage: (
              <Title type="danger" level={4}>
                {error.message}
              </Title>
            ),
          })
        );
    } else {
      mainConnect.clients
        .updateCredentials(this.newClient._id, credentials)
        .then((r) => this.setState({ statusMessage: <Title level={4}>Successfully edited steam client credentials</Title> }))
        .catch((error) =>
          this.setState({
            statusMessage: (
              <Title type="danger" level={4}>
                {error.message}
              </Title>
            ),
          })
        );
    }
    //Axios.post("/api/clients/");
  };

  startClient = () => {
    this.setStatusMessage("Loading...");
    const { client } = this.props;
    if (!client) {
      throw new LogError(`Client is not initalized`);
    }
    mainConnect.clients
      .startClient(client._id)
      .then(() => {
        this.setStatusMessage("Successfully started the client");

        const _id = this.props.client?._id;

        if (!_id) {
          throw new LogError("client is undefined");
        }

        this.setState({ isClientRunning: true });
        const update: AtLeast<WorkerClientModel, "_id"> = { _id, isRunning: true };

        this.props.onClientUpdate && this.props.onClientUpdate(update);
      })
      .catch((error) => this.setErrorStatusMessage("Error: " + JSON.stringify(error.response.data)));
  };

  restartClient = () => {
    this.setStatusMessage("Loading...");
    const { client } = this.props;
    if (!client) {
      throw new LogError(`Client is not initalized`);
    }
    mainConnect.clients
      .restartClient(client._id)
      .then(() => {
        this.setStatusMessage("Successfully restarted the client");

        const _id = this.props.client?._id;

        if (!_id) {
          throw new LogError("client is undefined");
        }

        this.setState({ isClientRunning: true });
        const update: AtLeast<WorkerClientModel, "_id"> = { _id, isRunning: true };

        this.props.onClientUpdate && this.props.onClientUpdate(update);
      })
      .catch((error) => this.setErrorStatusMessage("Error: " + JSON.stringify(error.response.data)));
  };

  stopClient = () => {
    this.setStatusMessage("Loading...");
    const { client } = this.props;
    if (!client) {
      throw new LogError(`Client is not initalized`);
    }
    mainConnect.clients
      .stopClient(client._id)
      .then(() => {
        this.setStatusMessage("Successfully stopped the client");

        const _id = this.props.client?._id;

        if (!_id) {
          throw new LogError("client is undefined");
        }

        this.setState({ isClientRunning: false });

        const update: AtLeast<WorkerClientModel, "_id"> = { _id, isRunning: false };

        this.props.onClientUpdate && this.props.onClientUpdate(update);
      })
      .catch((error) => this.setErrorStatusMessage("Error: " + JSON.stringify(error.response.data)));
  };
  newClient?: WorkerClientModel;
  public render() {
    const client = this.props.client;

    if (this.state.step === 1) {
      return (
        <Form initialValues={client as never} {...layout} onFinish={this.handleFinishFirstStep}>
          {this.state.statusMessage}
          <FormItem rules={[{ required: true, len: 17 }]} label="Steam id64 " htmlFor="_id" name="_id">
            <Input></Input>
          </FormItem>
          <FormItem rules={[{ required: true }]} label="Steam nickname" htmlFor="nickname" name="nickname">
            <Input></Input>
          </FormItem>
          <FormItem rules={[{ required: true, min: 0 }]} label="Level" htmlFor="level" name="level">
            <Input style={{ width: "100px" }} type="number"></Input>
          </FormItem>
          <FormItem rules={[{ required: true, min: 0 }]} label="Tier" htmlFor="tier" name="tier">
            <Input style={{ width: "100px" }} type="number"></Input>
          </FormItem>
          <FormItem rules={[{ required: true }]} label="Member since" htmlFor="memberSince" name="memberSince">
            <Input type="date"></Input>
          </FormItem>
          <FormItem rules={[{ required: true }]} label="Public ip" htmlFor="publicIp" name="publicIp">
            <Input></Input>
          </FormItem>
          <FormItem label="currency" required htmlFor="walletCurrency" name="walletCurrency">
            <Select
              className="horizontal-center"
              options={enumMembersToString(ECurrency).map((c) => {
                return { value: c };
              })}
            ></Select>
          </FormItem>
          <FormItem valuePropName="checked" label="Is allowed to add friends" htmlFor="isAllowedToAddFriends" name="isAllowedToAddFriends">
            <Switch {...switchSettings}></Switch>
          </FormItem>
          <FormItem valuePropName="checked" label="Is allowed to scan" htmlFor="isAllowedToScan" name="isAllowedToScan">
            <Switch {...switchSettings}></Switch>
          </FormItem>
          <FormItem valuePropName="checked" label="Is allowed to run" htmlFor="isAllowedToRun" name="isAllowedToRun">
            <Switch {...switchSettings}></Switch>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              Submit edit
            </Button>
            <Button onClick={() => window.open("https://steamcommunity.com/profiles/" + client?._id, "_blank")}>Open in steam</Button>
          </FormItem>
          {(() => {
            if (!this.props.createMode) {
              return [
                (() => {
                  if (this.state.isClientRunning || client?.isRunning) {
                    return [
                      <FormItem>
                        <Button onClick={this.restartClient} type="primary">
                          Restart client
                        </Button>
                      </FormItem>,
                      <FormItem>
                        <Button onClick={this.stopClient}>Stop client</Button>
                      </FormItem>,
                    ];
                  }
                  return (
                    <FormItem>
                      <Button onClick={this.startClient}> Start client </Button>
                    </FormItem>
                  );
                })(),

                (() => {
                  if (o_currentUser.getValue()?.claims.some((c) => c === ERegisteredUserClaim.Admin)) {
                    return (
                      <FormItem>
                        <Button style={{ position: "absolute", right: 0, top: 15 }} onClick={() => this.setState({ step: 2 })}>
                          Edit credentials
                        </Button>
                      </FormItem>
                    );
                  }
                })(),
              ];
            } else {
              return (
                <FormItem>
                  <Button htmlType="submit" type="primary">
                    Next
                  </Button>
                </FormItem>
              );
            }
          })()}
        </Form>
      );
    } else {
      return (
        <Form {...layout} onFinish={this.handleFinishSecondStep}>
          {this.state.statusMessage}
          <FormItem rules={[{ required: true }]} label="Steam log-in username" htmlFor="username" name="username">
            <Input />
          </FormItem>
          <FormItem rules={[{ required: true }]} label="Password" htmlFor="password" name="password">
            <Input.Password />
          </FormItem>
          <FormItem rules={[{ required: true }]} label="Shared secret" htmlFor="sharedSecret" name="sharedSecret">
            <Input.Password />
          </FormItem>
          <FormItem rules={[{ required: true }]} label="Identity secret" htmlFor="identitySecret" name="identitySecret">
            <Input.Password />
          </FormItem>
          {(() => {
            if (!this.props.createMode && o_currentUser.getValue()?.claims.some((c) => c === ERegisteredUserClaim.Admin)) {
              return (
                <FormItem>
                  <Button style={{ right: 0, position: "absolute" }} type="primary" htmlType="submit">
                    Submit credentials
                  </Button>
                </FormItem>
              );
            } else {
              return (
                <FormItem>
                  <Button style={{ right: 0, position: "absolute" }} type="primary" htmlType="submit">
                    Add client
                  </Button>
                </FormItem>
              );
            }
          })()}

          <Button onClick={() => this.setState({ step: 1 })}>Back</Button>
        </Form>
      );
    }
  }
}
