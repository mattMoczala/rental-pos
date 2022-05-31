import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Fetcher from "../core/Fetcher";
import Client from "../../types/Client";
import { Button, Card, CardActions, CardContent, IconButton, Paper, Typography } from "@mui/material";

interface State {
  width: number;
}

interface Props {
  data: Client;
  handleClientSelection: Function;
  handleClientDelete: Function;
  selectedClientId: string;
}

export default class CClient extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { width: window.innerWidth };
  }

  componentDidMount = (): void => {
    window.addEventListener("resize", this.updateWindowDimensions);
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  handleClick = (e: any) => {
    this.props.handleClientSelection({
      id: this.props.data._id,
      name: this.props.data.name,
      surname: this.props.data.surname,
    });
  };

  deleteClient = () => {
    if (confirm("Potwierdź usunięcie klienta") == true) {
    Fetcher.deleteClient(this.props.data._id).then(() => {
      this.props.handleClientDelete();
    });
    }
  };

  render(): React.ReactNode {
    return (
      <Card elevation={16}
        style={{
          border:
            this.props.selectedClientId === this.props.data._id
              ? "5px solid rgb(123,185,114)"
              : "0px solid rgb(196, 196, 196)",
          borderRadius: "2px",
          margin: "1em",
          marginTop: "1.5em",
          marginBottom: "1.5em",
          transition: ".3s",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: this.state.width < 700 ? "column" : "row",
        }}
      >
        <CardContent
          style={{
            width: this.state.width < 700 ? "auto" : "65%",
          }}
        >
          <div style={{display: "inline-block", marginBottom: "1.5em"}}>
          <Typography variant="h5">
          {this.props.data.name ? (
                this.props.data.name
              ) : (
                <Typography
                  style={{ color: "#9e9e9e", display: "inline-block" }}
                >
                  (nie podano imienia)
                </Typography>
              )} {" "}
              {this.props.data.surname ? (
                this.props.data.surname
              ) : (
                <Typography
                  style={{ color: "#9e9e9e", display: "inline-block" }}
                >
                  (nie podano nazwiska)
                </Typography>
              )}
          </Typography>
          </div>
          <Typography>
            <>
              Pesel:{" "}
              {this.props.data.pesel ? (
                this.props.data.pesel
              ) : (
                <Typography
                  style={{ color: "#9e9e9e", display: "inline-block" }}
                >
                  Nie podano
                </Typography>
              )}
            </>
          </Typography>
          <Typography>
            <>
              Tel:{" "}
              {this.props.data.phoneNumber ? (
                this.props.data.phoneNumber
              ) : (
                <Typography
                  style={{ color: "#9e9e9e", display: "inline-block" }}
                >
                  Nie podano
                </Typography>
              )}
            </>
          </Typography>
        </CardContent>
        <CardActions
          style={{
            width: this.state.width < 700 ? "auto" : "35%",
            marginTop: this.state.width < 700 ? "15px" : "0px",
            marginBottom: this.state.width < 700 ? "15px" : "0px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {this.props.selectedClientId === this.props.data._id ? (
            <Button style={{
              color: "rgb(123,185,114)",
              width: "100%",
              height: this.state.width < 700 ? "20px" : "50px",
              }} disabled>
              WYBRANO
            </Button>
          ) : (
            <Button
              onClick={this.handleClick}
              size="large"
              style={{
                width: "100%",
                height: this.state.width < 700 ? "20px" : "50px",
              }}
            >
              Wybierz
            </Button>
          )}
          <IconButton
            aria-label="delete"
            size="medium"
            onClick={this.deleteClient}
            name={this.props.data._id}
            id={this.props.data._id}
          >
            <DeleteIcon
              fontSize="medium"
              color="error"
              id={this.props.data._id}
            />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}
