import * as React from "react";

export interface ChatContainerProps {}

export interface ChatContainerState {}

export default class ChatContainer extends React.Component<ChatContainerProps, ChatContainerState> {
  constructor(props: ChatContainerProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div>{this.props.children}</div>;
  }
}
