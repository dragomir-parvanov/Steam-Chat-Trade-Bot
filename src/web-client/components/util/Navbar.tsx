import * as React from "react";
import { Menu, Button } from "antd";
import MenuItem from "antd/lib/menu/MenuItem";
import o_currentUser from "../../globals/observables/o_currentUser";
import { Redirect, NavLink } from "react-router-dom";
import RegisteredUserModel from "../../../models/site/RegisteredUserModel";

import d_rxjsStateMap from "../../functions/decorators/d_rxjsStateMap";
import SubMenu from "antd/lib/menu/SubMenu";
import Axios from "axios";
import ERegisteredUserClaim from "../../../models/site/enums/ERegisteredUserClaim";
import { g_isAdmin } from "../../globals/g_isAdmin";
import isUserAdmin from "../../../main-server/src/passport/isUserAdmin";

export interface NavbarProps {}

export interface NavbarState {
  currentUser: RegisteredUserModel | null;
}

@d_rxjsStateMap<NavbarState>({ currentUser: o_currentUser })
export default class Navbar extends React.Component<NavbarProps, NavbarState> {
  ifLogged = () => {
    const user = o_currentUser.getValue();
    if (user) {
      return (
        <SubMenu title={"Hi " + user._id} style={{ right: "10vh", position: "absolute" }}>
          <MenuItem>
            <NavLink exact to="/currentuser">
              User information
            </NavLink>
          </MenuItem>
          <MenuItem
            onClick={() => {
              Axios.get("/auth/logout").then(() => o_currentUser.next(null));
            }}
          >
            Log out
          </MenuItem>
        </SubMenu>
      );
    }
  };
  ifNotLogged = () => {
    const user = o_currentUser.getValue();
    if (!user) {
      return [
        <MenuItem style={{ right: 0, position: "absolute" }}>
          <NavLink exact to="/register">
            Register
          </NavLink>
        </MenuItem>,
        <MenuItem style={{ right: "10vh", position: "absolute" }}>
          <NavLink exact to="/login">
            Login
          </NavLink>
        </MenuItem>,
      ];
    }
  };
  ifUserHasMiningClaim = () => {
    const { currentUser } = this.state;
    if (!currentUser) {
      return;
    }

    if (currentUser.claims.some((c) => c === ERegisteredUserClaim.MiningManagement || ERegisteredUserClaim.MiningManagement)) {
      return (
        <MenuItem>
          <NavLink exact to="/miningmanagement">
            Mining Management
          </NavLink>
        </MenuItem>
      );
    }
  };
  ifUserHasClientManagementClaim = () => {
    const { currentUser } = this.state;
    if (!currentUser) {
      return;
    }
    if (!(g_isAdmin || currentUser.claims.some((c) => c === ERegisteredUserClaim.ClientsManagement))) {
      return;
    }

    return (
      <MenuItem>
        <NavLink exact to="/clientsmanagement">
          Clients management
        </NavLink>
      </MenuItem>
    );
  };
  ifUserHasChatPageClaim = () => {
    const { currentUser } = this.state;
    if (!currentUser) {
      return;
    }
    if (!(g_isAdmin || currentUser.claims.some((c) => c === ERegisteredUserClaim.ClientsManagement))) {
      return;
    }

    return (
      <MenuItem itemType="primary">
        <NavLink exact to="/chat">
          Chat
        </NavLink>
      </MenuItem>
    );
  };
  ifUserIsAdmin = () => {
    if (g_isAdmin) {
      return (
        <MenuItem>
          <NavLink exact to="/usersmanagement">
            Users management
          </NavLink>
        </MenuItem>
      );
    }
  };
  ifUserHaveMarketManagementClaim = () => {
    const { currentUser } = this.state;

    if (!isUserAdmin(currentUser) && !currentUser?.claims.some((c) => c === ERegisteredUserClaim.MarketManagement)) {
      return null;
    }

    return (
      <MenuItem>
        <NavLink exact to="market">
          Market Management
        </NavLink>
      </MenuItem>
    );
  };
  ifUserIsLoggedIn = () => {
    const { currentUser } = this.state;
    if (!currentUser) {
      return null;
    }

    return [
      <MenuItem>
        <NavLink exact to="/trades">
          Trades
        </NavLink>
      </MenuItem>,
      <MenuItem>
        <NavLink exact to="/summary">
          Summary
        </NavLink>
      </MenuItem>,
    ];
  };

  render() {
    return (
      <Menu style={{ width: "100%" }} mode="horizontal">
        <MenuItem>
          <NavLink exact to="/">
            Home
          </NavLink>
        </MenuItem>
        {this.ifLogged()}
        {this.ifNotLogged()}
        {this.ifUserHasChatPageClaim()}
        {this.ifUserHasMiningClaim()}
        {this.ifUserHasClientManagementClaim()}
        {this.ifUserIsLoggedIn()}
        {this.ifUserHaveMarketManagementClaim()}
        {this.ifUserIsAdmin()}
      </Menu>
    );
  }
}
