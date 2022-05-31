import * as React from "react";
import Fetcher from "../core/Fetcher";
import Client from "../../types/Client";
import { createTheme, TextField, ThemeProvider } from "@mui/material";
import CClient from "./CClient";
import filter from "../core/clientFilter";
import CSnackBar from "./CSnackBar";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

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
        <ThemeProvider theme={theme}>
          <TextField
            id="outlined-basic"
            label="Szukaj"
            variant="filled"
            style={{ color: "black", width: "100%",top: "0px", position: "sticky", backgroundColor: "white", zIndex: "1" }}
            onChange={this.handleInputChange}
            value={this.state.searchInputValue}
          />
        </ThemeProvider>
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
