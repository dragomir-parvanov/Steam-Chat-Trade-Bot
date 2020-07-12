import * as React from "react";
import d_userHasClaim from "../../functions/decorators/d_userHasClaim";
import ERegisteredUserClaim from "../../../models/site/enums/ERegisteredUserClaim";
import { Layout, Slider, Menu, Switch, Spin, Breadcrumb, Row, Col, Button, Modal } from "antd";
import g_miningStatus from "../../../main-server/src/globals/g_miningStatus";
import AddItemSellInformation from "./AddItemSellInformation";
import ScanGroup from "./ScanGroup";
import mainConnect from "../../../shared-network/express-function-router/implementations/mainConnect";

export interface MiningManagementProps {}

export interface MiningManagementState {
  collapsed: boolean;
  miningStatus: typeof g_miningStatus | null;
  isAddItemModalOpened: boolean;
  isScanGroupModalOpened: boolean;
}

const { Header, Content, Footer, Sider } = Layout;

@d_userHasClaim(ERegisteredUserClaim.MiningManagement)
export default class MiningManagement extends React.Component<MiningManagementProps, MiningManagementState> {
  constructor(props: MiningManagementProps) {
    super(props);
    console.log("Initialized");
    this.state = { collapsed: false, miningStatus: null, isAddItemModalOpened: false, isScanGroupModalOpened: false };
  }

  componentDidMount() {
    mainConnect.mining.getMiningStatus().then((miningStatus) => this.setState({ miningStatus }));
  }

  onItemsStatusMiningChange = (isItemMiningAllowed: boolean) => {
    const status: Partial<typeof g_miningStatus> = { isItemMiningAllowed };
    mainConnect.mining.updateMiningStatus(status).then((r) => {
      this.setState({ miningStatus: r });
    });
  };
  onProfilesStatusMiningChange = (isProfileMiningAllowed: boolean) => {
    const status: Partial<typeof g_miningStatus> = { isProfileMiningAllowed };

    mainConnect.mining.updateMiningStatus(status).then((r) => {
      this.setState({ miningStatus: r });
    });
  };

  openAddItemModal = () => {
    this.setState({ isAddItemModalOpened: true });
  };
  public render() {
    const { miningStatus } = this.state;
    if (!miningStatus) {
      return <Spin className="centered" />;
    }
    const { isAddItemModalOpened } = this.state;
    return (
      <Layout className="centered">
        <Content style={{ padding: "0 50px" }}>
          <Row gutter={15}>
            <Col>
              Is mining items allowed
              <br></br>
              <Switch defaultChecked={miningStatus?.isItemMiningAllowed} onChange={this.onItemsStatusMiningChange}></Switch>
            </Col>
            <Col>
              Is profiles mining allowed
              <br></br>
              <Switch defaultChecked={miningStatus?.isProfileMiningAllowed} onChange={this.onProfilesStatusMiningChange}></Switch>
            </Col>
          </Row>
          <Row style={{ marginTop: "3vh" }} gutter={15}>
            <Col>
              <Button onClick={this.openAddItemModal}>Add item</Button>
              <Button style={{ left: "100%", position: "absolute" }} onClick={() => this.setState({ isScanGroupModalOpened: true })}>
                Scan group
              </Button>
            </Col>
          </Row>
          <Modal
            okButtonProps={{ style: { display: "none" } }}
            visible={this.state.isAddItemModalOpened}
            title="Add sell information model"
            onCancel={() => this.setState({ isAddItemModalOpened: false })}
          >
            <AddItemSellInformation />
          </Modal>
          <Modal
            title="Scan group"
            onCancel={() => this.setState({ isScanGroupModalOpened: false })}
            okButtonProps={{ style: { display: "none" } }}
            visible={this.state.isScanGroupModalOpened}
          >
            <ScanGroup />
          </Modal>
        </Content>
      </Layout>
    );
  }
}
