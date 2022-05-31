import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Divider, IconButton, Paper, Typography } from "@mui/material";
import * as React from "react";
import RentalItem from "../../types/RentalItem";

interface State {}
interface Props {
  items: RentalItem[];
  deleteItemFromOrder: Function;
  style?: any;
  handleNextButtonClick: Function;
  nextButtonisDisabled: boolean;
  showPrevButton: boolean;
  handlePrevButtonClick: Function;
}

export default class CCreateOrderSideBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  private handleClick = (event) => {
    event.preventDefault();
    this.props.deleteItemFromOrder(event.currentTarget.name);
  };
  private handleNextButtonClick = (event) => {
    event.preventDefault();
    this.props.handleNextButtonClick();
  };
  private handlePrevButtonClick = (event) => {
    event.preventDefault();
    this.props.handlePrevButtonClick();
  };

  render() {
    let totalPrice = 0;
    return (
      <Paper style={this.props.style} >
        <div style={{ width: "100%" }}>
          {this.props.items.map((item) => {
            totalPrice += item.price;
            return (
              <div
                style={{
                  paddingBottom: "1.3em",
                  paddingTop: "1.3em",
                  paddingLeft: "1em",
                  paddingRight: "1em",
                  borderBottom: "2px solid #2e2e2e",
                }}
                key={item._id}
              >
                <Typography style={{ color: "white" }}>
                  {item.name} - nr: {item.itemRealIdentifier}
                  <br />
                  {item.price} zł{" "}
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={this.handleClick}
                    name={item._id}
                  >
                    <DeleteIcon
                      fontSize="small"
                      name={item._id}
                      color="error"
                    />
                  </IconButton>
                </Typography>
              </div>
            );
          })}
          <div
            style={{
              marginTop: "2em",
              marginBottom: "1em",
              textAlign: "center",
            }}
          >
            <Typography style={{ color: "white" }} variant="h5">
              Suma: {totalPrice} zł
            </Typography>
          </div>
          <IconButton aria-label="delete" size="small"></IconButton>
        </div>
        <Divider />
        <Button
          style={{ width: "100%", fontSize: "1.5em", marginTop: "1em" }}
          color="success"
          onClick={this.handleNextButtonClick}
          disabled={this.props.nextButtonisDisabled}
        >DALEJ</Button>
        {this.props.showPrevButton ? (
          <Button
            style={{ width: "100%", fontSize: "1.5em" }}
            color="error"
            onClick={this.handlePrevButtonClick}
          >
            WRÓĆ
          </Button>
        ) : (
          ""
        )}
      </Paper>
    );
  }
}
