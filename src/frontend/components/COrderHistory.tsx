import {
    createTheme,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  ThemeProvider,
  Typography,
} from "@mui/material";
import * as React from "react";
import { RentalPopulatedWithData } from "../../types/Rental";
import Fetcher from "../core/Fetcher";
import dateToReadableString from "../core/dateToReadableString";

interface Props {}
interface State {
  orders: RentalPopulatedWithData[];
  sortBy: "old-new" | "new-old";
}

export default class COrderHistory extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      sortBy: "old-new",
    };
  }

  componentDidMount(): void {
    Fetcher.getRentals().then((response) => {
      if (response.ok) {
        this.setState({
          orders: response.data,
        });
      }
    });
  }

  handleChange = (e: any) => {
    if (e.target.value !== this.state.sortBy) {
        this.setState({
            orders: this.state.orders.reverse()
        })
    }
    this.setState({
      sortBy: e.target.value,
    });
  };

  render() {
    return (
      <>
        <ThemeProvider
          theme={createTheme({
            palette: {
              mode: "light",
            },
          })}
        >
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label">
              Sortuj po
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={this.state.sortBy}
              onChange={this.handleChange}
            >
              <MenuItem value={"new-old"}>Dacie (od najnowszych)</MenuItem>
              <MenuItem value={"old-new"}>Dacie (od najstarszych)</MenuItem>
            </Select>
          </FormControl>
        </ThemeProvider>
        <List>
          {this.state.orders.map((order) => {
            return (
              <ListItem key={order._id}>
                <Paper elevation={12} style={{ width: "100%" }}>
                  <div style={{ padding: "1em" }}>
                    {order.client ? (
                      <>
                        <Typography variant="h5">Dane klienta</Typography>
                        <Typography>Imie: {order.client?.name}</Typography>
                        <Typography>
                          Nazwisko: {order.client?.surname}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h5">
                        klient został usunięty z bazy
                      </Typography>
                    )}
                  </div>
                  <div style={{ padding: "1em" }}>
                    <Typography>
                      Czas wypożyczenia: {dateToReadableString(order.startDate)}
                    </Typography>
                    <Typography>
                      {" "}
                      - {dateToReadableString(order.endDate)}
                    </Typography>
                  </div>
                  <div style={{ padding: "1em" }}>
                    <Typography> Cena: {order.priceTotal}</Typography>
                  </div>
                </Paper>
              </ListItem>
            );
          })}
        </List>
      </>
    );
  }
}
