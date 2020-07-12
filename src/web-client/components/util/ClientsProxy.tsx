import * as React from "react";
import { SteamId64 } from "../../../models/types/SteamId64";

export interface ClientsProxyProps {}

export interface ClientsProxyState {
  currentClientId: SteamId64 | null;
}

export default class ClientsProxy extends React.Component<ClientsProxyProps, ClientsProxyState> {
  constructor(props: ClientsProxyProps) {
    super(props);

    this.state = { currentClientId: null };
  }

  public render() {
    let { currentClientId } = this.state;
    return (
      <div style={{ height: 1000 }}>
        Client proxy
        {currentClientId}
        {(() => {
          if (!currentClientId) {
            currentClientId = "76561198203198914";
            //return null;
          }
          const defaultQuery =
            "?proxyUrl=" +
            encodeURIComponent("http://steamcommunity.com/profiles/" + currentClientId) +
            "&clientId=" +
            encodeURIComponent(currentClientId);
          return <iframe width="100%" height="100%" src={"http://localhost/api/proxy/" + defaultQuery}></iframe>;
        })()}
      </div>
    );
  }
}
