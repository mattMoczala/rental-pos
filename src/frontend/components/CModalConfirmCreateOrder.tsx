import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FilledInput,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import Client from "../../types/Client";
import Item from "../../types/Item";

interface Props {
  resolveCallback: Function;
  isOpen: boolean;
  itemsInOrder: Item[];
  clientName: string;
}
interface State {
  orderPrice: () => number;
  discount: boolean;
  fixedPrice: number;
}

export default class CModalConfirmCreateOrder extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      orderPrice: this.itemsPriceSum,
      discount: false,
      fixedPrice: 0,
    };
  }

  private itemsPriceSum = (): number => {
    if (!this.state.discount || this.state.fixedPrice === 0) {
      let sum = 0;
      this.props.itemsInOrder.forEach((item) => {
        sum += item.price;
      });
      return sum;
    } else {
      return this.state.fixedPrice;
    }
  };

  handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const reject = (e.target as HTMLAnchorElement).id !== "succ" ? true : false;

    if (reject) {
      this.props.resolveCallback(true, this.state.orderPrice());
    } else {
      this.props.resolveCallback(false, this.state.orderPrice());
    }
  };

  handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevVal = this.state.discount;
    this.setState({
      discount: !prevVal,
      fixedPrice: 0,
    });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({
      fixedPrice: Number(e.target.value),
    });
  };

  render() {
    return (
      <Dialog open={this.props.isOpen}>
        <Box>
          <DialogTitle>Potwierdź zamówienie</DialogTitle>
          <DialogContent>
            <Typography>
              <>Klient: {this.props.clientName}</>
            </Typography>
            <DialogContentText>
              {this.props.itemsInOrder.map((item, i) => {
                return (
                  <div key={item._id + i}>
                    <Typography>
                      {item.name} | {item.price} zł
                    </Typography>
                  </div>
                );
              })}
            </DialogContentText>
            <FormGroup
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                justifyItems: "center",
              }}
            >
              <Box>
                <FilledInput
                  value={this.state.orderPrice()}
                  type="number"
                  onChange={this.handleInputChange}
                  endAdornment={
                    <InputAdornment position="end">zł</InputAdornment>
                  }
                  autoComplete="off"
                  disabled={!this.state.discount}
                  style={{
                    marginTop: "1em",
                  }}
                />
                <FormHelperText id="filled-weight-helper-text">
                  Cena łącznie
                </FormHelperText>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    value={this.state.discount}
                    onChange={this.handleCheckboxChange}
                  />
                }
                label="zniżka"
                labelPlacement="bottom"
                style={{ color: "rgb(183,183,183)" }}
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button
              color="success"
              onClick={this.handleClick}
              id="succ"
              size="large"
            >
              Zatwierdź
            </Button>
            <Button
              color="error"
              onClick={this.handleClick}
              id="err"
              size="large"
            >
              Anuluj
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }
}
