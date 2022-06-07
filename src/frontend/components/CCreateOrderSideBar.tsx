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
        <div style={{
          textAlign: "center",
          position: "sticky",
          backgroundColor: "rgb(30,30,30)",
          boxShadow: "0px 2px 28px 8px rgba(0,0,0,0.75)",
          top:"0",
          zIndex: "1",
          paddingTop: "1.5em",
          paddingBottom: "1.5em",
        }}>
        <Button
          style={{ width: "100%", fontSize: "1.5em", }}
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
        </div>
        <Divider/>
        <div style={{width: "100%",paddingBottom: "100px" }}>
          {this.props.items.map((item,index) => {
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
                key={item._id+index+item.itemRealIdentifier}
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
              textAlign: "center",
              position: "fixed",
              width: this.props.style.minWidth? this.props.style.minWidth : "170px",
              backgroundColor: "rgb(30,30,30)",
              boxShadow: "0px -1px 28px 8px rgba(0,0,0,0.75)",
              bottom:"0"
            }}
          >
            <Divider/>
            <div style={{padding:"1.5em"}}>
            <Typography variant="body2" color="text.secondary">
              w sumie:
            </Typography>
            <Typography style={{ color: "white" }} variant="h5">
              {totalPrice} zł
            </Typography>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}
