import * as React from "react";
import { Button, Layout } from "antd";
import ClientEdit from "./ClientEdit";
import WorkerClientModel from "../../../../models/WorkerClientModel";
import AtLeast from "../../../../models/types/AtLeast";
import SendTradeOfferFromClient from "./SendTradeOfferFromClient";

export interface ClientManagementProps {
  client: WorkerClientModel;
  onClient: (client: WorkerClientModel) => void;
  onClientUpdate: (update: AtLeast<WorkerClientModel, "_id">) => void;
}

export interface ClientManagementState {
  currentMode: JSX.Element;
}
const { Header, Content, Footer } = Layout;
export default class ClientManagement extends React.Component<ClientManagementProps, ClientManagementState> {
  constructor(props: ClientManagementProps) {
    super(props);

    this.state = {
      currentMode: <ClientEdit key={props.client._id} client={props.client} onClient={props.onClient} onClientUpdate={props.onClientUpdate} />,
    };
  }

  public render() {
    const { client, onClient, onClientUpdate } = this.props;
    const { currentMode } = this.state;
    return (
      <div>
        <Layout>
          <Content style={{ paddingBottom: "3vh" }}>{currentMode}</Content>
          <Footer>
            <Button
              onClick={() =>
                this.setState({ currentMode: <ClientEdit key={client._id} client={client} onClient={onClient} onClientUpdate={onClientUpdate} /> })
              }
            >
              Edit client
            </Button>
            {(() => {
              if (client.isRunning) {
                return <Button onClick={() => this.setState({ currentMode: <SendTradeOfferFromClient clientId={client._id} /> })}>Send offer</Button>;
              }
            })()}
          </Footer>
        </Layout>
      </div>
    );
  }
}
