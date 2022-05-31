import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  TextField,
} from "@mui/material";
import * as React from "react";
import Client from "../../types/Client";
import Item from "../../types/Item";
import Fetcher from "../core/Fetcher";
import CSnackBar from "./CSnackBar";

interface Props {
  resolveCallback: Function;
  isOpen: boolean;
}
interface State {
  name: string;
  surname: string;
  pesel: string;
  tel: string;
  nip: string;
  showSnackBar: boolean;
  snackBarMessage: string;
}

const inputStyle = {
  marginTop: ".5em",
  marginBottom: ".5em",
};

export default class CCreateClientModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "",
      surname: "",
      tel: "",
      pesel: "",
      nip: "",
      snackBarMessage: "",
      showSnackBar: false
    };
  }

  componentDidMount(): void {
    document.addEventListener("keyup", this.handleKeyStroke, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keyup", this.handleKeyStroke, false);
  }

  handleKeyStroke = ({key}) => {
    if (key === "Escape") {
      this.props.resolveCallback(false)
    }
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const client = [
      this.state.name,
      this.state.surname,
      this.state.pesel,
      this.state.tel,
      this.state.nip,
    ] as const;
    if ((event.target as HTMLAnchorElement).id === "succ") {
      Fetcher.postClient(...client).then((res) => {
        if (res.ok) {
          this.setState({ name: "", surname: "", tel: "", pesel: "", nip: "", showSnackBar: true, snackBarMessage: "Pomyślnie utworzono klienta"});
          this.props.resolveCallback(true);
          setTimeout(() => {
            this.setState({showSnackBar: false})
          }, 3500);
        }
      });
    } else {
      this.props.resolveCallback(false);
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stateUpdate = {};
    stateUpdate[event.target.id] = event.target.value;
    this.setState(stateUpdate);
  };

  render() {
    return (
      <>
        <Dialog open={this.props.isOpen}>
          <Box style={{padding: "1em"}}>
            <DialogTitle>Dodaj klienta</DialogTitle>
            <DialogContent>
              <FormGroup>
                <TextField
                  id="name"
                  label="Imię"
                  style={inputStyle}
                  value={this.state.name}
                  onChange={this.handleChange}
                  autoComplete='off'
                />
                <TextField
                  id="surname"
                  label="Nazwisko"
                  style={inputStyle}
                  value={this.state.surname}
                  onChange={this.handleChange}
                  autoComplete='off'
                />
                <TextField
                  id="pesel"
                  label="Pesel"
                  style={inputStyle}
                  value={this.state.pesel}
                  onChange={this.handleChange}
                  autoComplete='off'
                />
                <TextField
                  id="tel"
                  label="Numer telefonu"
                  style={inputStyle}
                  value={this.state.tel}
                  onChange={this.handleChange}
                  autoComplete='off'
                />
                <TextField
                  id="nip"
                  label="NIP"
                  style={inputStyle}
                  value={this.state.nip}
                  onChange={this.handleChange}
                  autoComplete='off'
                />
              </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button
                color="success"
                variant="contained"
                onClick={this.handleClick}
                id="succ"
                size="large"
                style={{margin: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px"}}
              >
                Zatwierdź
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={this.handleClick}
                id="err"
                size="large"
                style={{margin: "0px", borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}
              >
                Anuluj
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
        <CSnackBar
          open={this.state.showSnackBar}
          message={this.state.snackBarMessage}
        />
      </>
    );
  }
}
