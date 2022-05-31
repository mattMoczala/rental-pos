import { Button, Paper } from "@mui/material";
import * as React from "react";
import ClientSearch from "./CClientSearch";
import CCreateClientModal from "./CCreateClientModal";

interface State {
  createClientModalisOpen: boolean;
  newClientsCreated: boolean;
}
interface Props {
  handleClientSelection: Function;
}

export default class CSelectClient extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { createClientModalisOpen: false, newClientsCreated: false };
  }

  openCreateClientModal = () => {
    this.setState({
      createClientModalisOpen: true,
    });
  };

  resolveCreateClientModal = (res: boolean) => {
    if (res) {
      console.log("created client");
      this.setState({ newClientsCreated: true });
      this.setState({ newClientsCreated: false });
    }
    this.setState({
      createClientModalisOpen: false,
    });
  };

  render(): React.ReactNode {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          overflowY: "clip",
        }}
      >
        <ClientSearch
          style={{
            width: "60%",
            overflowY: "scroll",
          }}
          handleClientSelection={this.props.handleClientSelection}
          createdClientsAmount={this.state.newClientsCreated}
        />
        <Button
          style={{
            width: "40%",
            overflowY: "clip",
            backgroundColor: "#121212",
            zIndex: "2",
            borderRadius: "0px"
          }}
          onClick={this.openCreateClientModal}
          disableRipple
        >
          Stwórz nowego klienta
        </Button>
        <CCreateClientModal
          isOpen={this.state.createClientModalisOpen}
          resolveCallback={this.resolveCreateClientModal}
        />
      </div>
    );
  }
}
