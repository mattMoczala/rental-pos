import * as React from "react";
import Fetcher from "../core/Fetcher";
import Client from "../../types/Client";
import { createTheme, Paper, TextField, ThemeProvider } from "@mui/material";
import CClient from "./CClient";
import filter from "../core/clientFilter";
import CSnackBar from "./CSnackBar";

interface State {
  fetchedClients: Client[];
  clients: Client[];
  searchInputValue: string;
  selectedClientId: string;
  showSnackBar: boolean;
  snackBarMessage: string;
}
interface Props {
  style: React.CSSProperties;
  handleClientSelection: Function;
  createdClientsAmount: boolean;
}

export default class CClientSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      clients: [],
      fetchedClients: [],
      searchInputValue: "",
      selectedClientId: "",
      showSnackBar: false,
      snackBarMessage: "",
    };
  }

  private _fetchData = () => {
    Fetcher.getClients().then((response) => {
      if (response.ok && response.data) {
        this.setState({
          clients: response.data,
          fetchedClients: response.data,
        });
      }
    });
  };

  componentDidMount(): void {
    this._fetchData();
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    if (this.props.createdClientsAmount) {
      this._fetchData();
    }
  }

  private handleInputChange = (e: React.ChangeEvent) => {
    const inputValue = (e.target as HTMLInputElement).value;

    this.setState({
      searchInputValue: inputValue,
      clients: filter(inputValue, this.state.fetchedClients),
    });
  };

  handleClientSelection = (data) => {
    this.setState({
      selectedClientId: data.id,
    });
    this.props.handleClientSelection(data);
  };
  handleClientDelete = () => {
    this._fetchData();
    this.setState({
      showSnackBar: true,
      snackBarMessage: "Pomyślnie usuniętno klienta",
    });

    setTimeout(() => {
      this.setState({
        showSnackBar: false,
      });
    }, 3500);
  };

  render(): React.ReactNode {
    return (
      <div
        style={{
          ...this.props.style,
        }}
      >
        <Paper
          style={{
            padding: "1.5em",
            borderRadius: 0,
            top: "0px",
            position: "sticky",
            zIndex: "1",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Szukaj"
            variant="filled"
            style={{ width: "100%"}}
            onChange={this.handleInputChange}
            value={this.state.searchInputValue}
          />
        </Paper>
        <div>
          {this.state.clients.map((client) => {
            return (
              <CClient
                data={client}
                key={client._id}
                handleClientSelection={this.handleClientSelection}
                selectedClientId={this.state.selectedClientId}
                handleClientDelete={this.handleClientDelete}
              />
            );
          })}
          <CSnackBar
            open={this.state.showSnackBar}
            message={this.state.snackBarMessage}
          />
        </div>
      </div>
    );
  }
}
