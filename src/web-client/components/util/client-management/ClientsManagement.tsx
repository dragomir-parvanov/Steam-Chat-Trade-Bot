import * as React from "react";
import { Button, Modal, Table, Spin } from "antd";

import WorkerClientModel from "../../../../models/WorkerClientModel";
import { ColumnsType } from "antd/lib/table/Table";
import d_userHasClaim from "../../../functions/decorators/d_userHasClaim";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import { ECurrency } from "../../../../models/enums/ECurrency";
import columnGenerator from "../../../functions/table/columnGenerator";
import AtLeast from "../../../../models/types/AtLeast";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import ClientEdit from "./ClientEdit";
import ClientManagement from "./ClientManagement";

export interface ClientsManagementProps {}

export interface ClientsManagementState {
  isAddClientModalOpened: boolean;
  isEditClientModalOpened: boolean;
  clients: WorkerClientModel[];
  currentClientForEdit: WorkerClientModel | undefined;
}

const okButtonProps = { style: { display: "none" } };

@d_userHasClaim(ERegisteredUserClaim.ClientsManagement)
export default class ClientsManagement extends React.Component<ClientsManagementProps, ClientsManagementState> {
  constructor(props: ClientsManagementProps) {
    super(props);
    console.log("init");
    this.state = { isAddClientModalOpened: false, clients: [], currentClientForEdit: undefined, isEditClientModalOpened: false };
  }

  componentDidMount() {
    mainConnect.clients.getAllClients().then((clients) => {
      clients.forEach((w) => {
        w.walletCurrency = ECurrency[w.walletCurrency] as never;
      });
      this.setState({ clients });
    });
  }
  onNewClient = (client: WorkerClientModel) => {
    client.walletCurrency = ECurrency[client.walletCurrency] as never;
    this.setState(({ clients }) => {
      const newState = [...clients, client];
      this.setState({ clients: newState });
    });
  };

  handleUpdatedClient = (client: WorkerClientModel) => {
    client.walletCurrency = ECurrency[client.walletCurrency] as never;
    this.setState(({ clients }) => {
      const index = clients.findIndex((c) => c._id === client._id);
      const newState = [...clients];
      newState[index] = client;
      this.setState({ clients: newState });
    });
  };

  /**
   *this differs from the one from top with updating only specific fields
   *
   * @memberof ClientsManagement
   */
  handleClientUpdate = (update: AtLeast<WorkerClientModel, "_id">) => {
    this.setState(({ clients }) => {
      const newState = [...clients];
      const index = clients.findIndex((c) => c._id === update._id);

      newState[index] = { ...newState[index], ...update };

      this.setState({ clients: newState });
    });
  };
  public render() {
    const { clients } = this.state;
    let isTableLoading = true;
    let testColumns: ColumnsType<WorkerClientModel> = [];
    if (clients.length > 0) {
      testColumns = columnGenerator(clients[0]);

      isTableLoading = false;
    }

    return (
      <div>
        <Button style={{ left: "90%" }} onClick={() => this.setState({ isAddClientModalOpened: true })} type="primary">
          Add client
        </Button>
        <Button style={{ left: "70%" }} onClick={mainConnect.clients.startAllAllowedToRunSteamChilds} type="primary">
          Start all clients
        </Button>
        <Modal
          okButtonProps={okButtonProps}
          onCancel={() => this.setState({ isAddClientModalOpened: false })}
          visible={this.state.isAddClientModalOpened}
          title="Add client"
        >
          <ClientEdit onClient={this.onNewClient} createMode />
        </Modal>
        <Modal
          okButtonProps={okButtonProps}
          style={{ top: "2.5%" }}
          destroyOnClose={true}
          onCancel={() => this.setState({ isEditClientModalOpened: false })}
          visible={this.state.isEditClientModalOpened}
          title="Manage client"
        >
          <ClientManagement onClient={this.handleUpdatedClient} onClientUpdate={this.handleClientUpdate} client={this.state.currentClientForEdit!} />
        </Modal>
        <Table
          loading={isTableLoading}
          onRow={(record, index) => {
            return {
              onClick: () => {
                this.setState({ currentClientForEdit: record, isEditClientModalOpened: true });
              },
            };
          }}
          columns={testColumns}
          dataSource={this.state.clients}
          rowKey={(r) => r._id}
        ></Table>
      </div>
    );
  }
}
