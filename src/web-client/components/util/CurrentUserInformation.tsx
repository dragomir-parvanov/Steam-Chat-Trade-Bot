import * as React from "react";
import UserInformation from "../common/UserInformation";
import RegisteredUserModel from "../../../models/site/RegisteredUserModel";
import d_rxjsStateMap from "../../functions/decorators/d_rxjsStateMap";
import o_currentUser from "../../globals/observables/o_currentUser";
import Title from "antd/lib/typography/Title";

export interface CurrentUserInformationProps {}

export interface CurrentUserInformationState {
  currentUser: RegisteredUserModel | null;
}
@d_rxjsStateMap<CurrentUserInformationState>({ currentUser: o_currentUser })
export default class CurrentUserInformation extends React.Component<CurrentUserInformationProps, CurrentUserInformationState> {
  constructor(props: CurrentUserInformationProps) {
    super(props);
  }

  public render() {
    return (
      <div className="centered">
        <Title>Current logged user</Title>
        <UserInformation user={this.state.currentUser} />
      </div>
    );
  }
}
