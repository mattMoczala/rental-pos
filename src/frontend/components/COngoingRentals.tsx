import {
  CardActionArea,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import * as React from "react";
import Fetcher from "../core/Fetcher";
import { RentalPopulatedWithData } from "../../types/Rental";
import EditIcon from "@mui/icons-material/Edit";
import dateToReadableString from "../core/dateToReadableString";
import CRentalDetailsModal from "./CRentalDetailsModal";
import CSnackBar from "./CSnackBar";

interface State {
  fetchedRentals: RentalPopulatedWithData[];
  openRentalDetailsModal: boolean;
  selectedRental: RentalPopulatedWithData;
  showSnackBar: boolean;
  snackBarMessage: string;
}
interface Props {
  itemId: string;
  forceParentUpdate: Function
}

export default class COngoingRentals extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      fetchedRentals: [],
      openRentalDetailsModal: false,
      selectedRental: {} as RentalPopulatedWithData,
      showSnackBar: false,
      snackBarMessage: "",
    };
  }

  private _fetch = () => {
    Fetcher.getRentals(this.props.itemId, true).then((response) => {
      if (response.ok && response.data) {
        this.setState({
          fetchedRentals: response.data,
        });
      }
    });
  }

  componentDidMount(): void {
    this._fetch()
  }

  rentalDetailsCallback = (ok: boolean) => {
    if (ok) {
      this.setState({
        openRentalDetailsModal: false,
        snackBarMessage: "Pomyślnie odznaczono zjazd rowerka",
        showSnackBar: true,
      });
      this._fetch();
      this.props.forceParentUpdate()
      setTimeout(() => {
        this.setState({
          showSnackBar: false,
          snackBarMessage: "",
        });
      }, 3500);
    } else {
      this.setState({
        openRentalDetailsModal: false,
      });
    }
  };

  getItemRealIdentifier = (rental: RentalPopulatedWithData) => {
    return rental.rented.find(
      (rentedItem) => rentedItem.item._id === this.props.itemId
    );
  };

  handleClick = (e: React.MouseEvent) => {
    this.setState({
      openRentalDetailsModal: true,
      selectedRental: this.state.fetchedRentals.find(
        (element) => element._id === (e.currentTarget as HTMLButtonElement).name
      ),
    });
  };

  render() {
    return (
      <div>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ marginBottom: "1em" }}
        >
          Obecne wypożyczenia:
        </Typography>
        {this.state.fetchedRentals.map((rental) => {
          return (
            <Paper
              elevation={24}
              key={rental._id}
              style={{
                marginTop: "1em",
                marginBottom: "1em",
                borderRadius: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <CardActionArea
                  onClick={this.handleClick}
                  name={rental._id}
                  style={{
                    padding: "1em",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div>
                    {rental.client ? (
                      <div style={{ display: "flex" }}>
                        <Typography variant="h6">
                          {rental.client.name
                            ? rental.client.name
                            : "nie podano imienia"}
                        </Typography>
                        &nbsp;
                        <Typography variant="h6">
                          {rental.client.surname
                            ? rental.client.surname
                            : "nie podano naziwska"}
                        </Typography>
                      </div>
                    ) : (
                      <Typography color="text.secondary">
                        klient został usunięty
                      </Typography>
                    )}
                    <Typography>
                      {"Powrót: " + dateToReadableString(rental.endDate)}
                    </Typography>
                    <Typography>
                      Nr rowera:{" "}
                      {this.getItemRealIdentifier(rental).itemRealIdentifier}
                    </Typography>
                  </div>
                </CardActionArea>
                <IconButton
                  style={{ padding: "1em" }}
                  onClick={this.handleClick}
                  name={rental._id}
                >
                  <EditIcon style={{ color: "rgb(123,185,114)" }} 
                  />
                </IconButton>
              </div>
            </Paper>
          );
        })}
        <CRentalDetailsModal
          isOpen={this.state.openRentalDetailsModal}
          rental={this.state.selectedRental}
          resolveCallback={this.rentalDetailsCallback}
        />
        <CSnackBar
          open={this.state.showSnackBar}
          message={this.state.snackBarMessage}
        />
      </div>
    );
  }
}
