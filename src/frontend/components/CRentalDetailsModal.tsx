import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, Typography } from "@mui/material";
import * as React from "react";
import Fetcher from "../core/Fetcher";
import {RentalPopulatedWithData} from "../../types/Rental"

interface State {
}
interface Props {
    rental: RentalPopulatedWithData
    resolveCallback: Function
    isOpen: boolean,
}

export default class CRentalDetailsModal extends React.Component<Props, State> {
  componentDidMount(): void {
    document.addEventListener("keyup", this.handleKeyStroke, false);
  }

  handleKeyStroke = ({key})=> {
    if (key === "Enter")
      Fetcher.changeRentalStatus(this.props.rental._id).then(()=> {
        this.props.resolveCallback(true);
      })
    else if (key === "Escape") {
      this.props.resolveCallback(false);
    }
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if ((event.target as HTMLAnchorElement).id === "succ") {
      Fetcher.changeRentalStatus(this.props.rental._id).then(()=> {
        this.props.resolveCallback(true);
      })
    } else {
      this.props.resolveCallback(false);
    }
  };

  render() {
    return (
      <>
        <Dialog open={this.props.isOpen}>
          <Box style={{padding: "1em"}}>
            <DialogTitle>Zatwierdź zjazd rowerków</DialogTitle>
            <DialogContent>
                <Typography>Zamówienie:</Typography>
                {this.props.rental.rented ? this.props.rental.rented.map((rentedItem,index)=> {
                  return (
                    <Typography color="text.secondary" key={index}>{`${rentedItem.item.name} | nr ${rentedItem.itemRealIdentifier}`}</Typography>
                  )
                }) : ""}
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
      </>

    );
  }
}
