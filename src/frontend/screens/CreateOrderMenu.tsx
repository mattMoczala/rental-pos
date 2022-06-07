import {
  Box,
  Button,
  createTheme,
  Dialog,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import * as React from "react";
import Item from "../../types/Item";
import RentalItem from "../../types/RentalItem";
import CItem from "../components/CItem";
import CCreateOrderSideBar from "../components/CCreateOrderSideBar";
import CSelectClient from "../components/CSelectClient";
import CModalConfirmCreateOrder from "../components/CModalConfirmCreateOrder";
import Fetcher from "../core/Fetcher";
import CSnackBar from "../components/CSnackBar";

interface State {
  items: Item[];
  searchInputValue: string;
  itemsFiltered: Item[];
  dialogOpen: boolean;
  confirmOrderDialogOpen: boolean;
  rentalItemsSelected: RentalItem[];
  modalInput: string;
  showClientMenu: boolean;
  selectedClientId: string;
  selectedClientName: string;
  showSnackBar: boolean;
  snackBarMessage: string;
}
interface Props {}

export default class CreateOrderMenu extends React.Component<Props, State> {
  private selectedItem: Item = {
    name: "",
    image: "",
    price: 0,
    unitsAviable: 0,
    unitsTotal: 0,
    createdOn: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      snackBarMessage: "",
      searchInputValue: "",
      showSnackBar: false,
      items: [],
      itemsFiltered: [],
      confirmOrderDialogOpen: false,
      selectedClientName: "",
      dialogOpen: false,
      rentalItemsSelected: [],
      modalInput: "",
      showClientMenu: false,
      selectedClientId: "",
    };
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyStroke, false);
    Fetcher.getItems().then((response) => {
      if (response.ok && response.data) {
        this.setState({
          items: response.data,
          itemsFiltered: response.data,
        });
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyStroke, false);
  }

  handleKeyStroke = ({ key }) => {
    if (key === "Escape") {
      this.setState({
        dialogOpen: false,
        modalInput: "",
      });
    }
  };

  handleDialogOpen = (item: Item) => {
    this.selectedItem = item;
    this.setState({
      dialogOpen: true,
    });
  };

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
      modalInput: "",
    });
  };

  handleModalInputChange = (e) => {
    this.setState({
      modalInput: e.target.value,
    });
  };

  private handleNextButtonClick = () => {
    if (this.state.showClientMenu == false) {
      this.setState({
        showClientMenu: true,
      });
    } else {
      this.setState({
        confirmOrderDialogOpen: true,
      });
    }
  };
  handlePrevButtonClick = () => {
    this.setState({
      showClientMenu: false,
      selectedClientId: "",
    });
  };

  private markCurrentItemAsSelected = (itemRealIdentifier: string) => {
    const rentalItem = { ...this.selectedItem, itemRealIdentifier };
    this.setState({
      rentalItemsSelected: [...this.state.rentalItemsSelected, rentalItem],
    });
    let itemsArrCopy = this.state.items.slice();
    itemsArrCopy.forEach((item: Item) => {
      if (item._id === rentalItem._id) {
        item.unitsAviable -= 1;
      }
    });
    this.setState({
      items: itemsArrCopy,
    });
  };

  private handleClientSelection = (data) => {
    this.setState({
      selectedClientId: data.id,
      selectedClientName: `${data.name ? data.name : ""} ${
        data.surname ? data.surname : ""
      }`,
    });
  };

  private deleteItemFromOrder = (id) => {
    let rentalItemsArrCopy = this.state.rentalItemsSelected.slice();
    let index: number;
    rentalItemsArrCopy.forEach((item: Item, i) => {
      if (item._id === id) {
        index = i;
      }
    });
    rentalItemsArrCopy.splice(index, 1);

    let itemsArrCopy = this.state.items.slice();
    itemsArrCopy.forEach((item: Item) => {
      if (item._id === id) {
        item.unitsAviable += 1;
      }
    });

    this.setState({
      rentalItemsSelected: rentalItemsArrCopy,
      items: itemsArrCopy,
    });
  };

  private handleOrderConfirm = (reject: boolean, orderPrice: number) => {
    this.setState({
      confirmOrderDialogOpen: false,
    });
    if (!reject) {
      let endDate = new Date();
      Fetcher.postOrder(
        this.state.selectedClientId,
        this.state.rentalItemsSelected,
        orderPrice,
        endDate
      ).then((response) => {
        if (response.ok) {
          this.setState({
            selectedClientName: "",
            dialogOpen: false,
            rentalItemsSelected: [],
            modalInput: "",
            showClientMenu: false,
            selectedClientId: "",
            showSnackBar: true,
            snackBarMessage: "Pomyślnie utworzono zamówienie",
          });
          setTimeout(() => {
            this.setState({
              showSnackBar: false,
            });
          }, 3500);
        } else {
          this.setState({
            showSnackBar: true,
            snackBarMessage: "Wystąpił błąd podczas tworzenia zamówienia",
          });
          setTimeout(() => {
            this.setState({
              showSnackBar: false,
            });
          }, 3500);
        }
      });
    }
  };

  private _filter = (filter) => {
    let filtered = [];
    this.state.items.forEach((item) => {
      if (item.name.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
        filtered.push(item);
      }
    });
    return filtered;
  };

  private handleInputChange = (e: React.ChangeEvent) => {
    const inputValue = (e.target as HTMLInputElement).value;

    this.setState({
      searchInputValue: inputValue,
      itemsFiltered: this._filter(inputValue),
    });
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
        }}
      >
        <CCreateOrderSideBar
          handleNextButtonClick={this.handleNextButtonClick}
          showPrevButton={this.state.showClientMenu}
          items={this.state.rentalItemsSelected}
          deleteItemFromOrder={this.deleteItemFromOrder}
          handlePrevButtonClick={this.handlePrevButtonClick}
          nextButtonisDisabled={
            this.state.showClientMenu
              ? this.state.selectedClientId === ""
              : this.state.rentalItemsSelected.length <= 0
          }
          style={{
            minWidth: "170px",
            borderRadius: "0px",
            overflowY: "scroll",
            height: this.state.showClientMenu ? "100vh" : "100%",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            overflowY: "scroll",
          }}
        >
          {this.state.showClientMenu ? (
            <CSelectClient handleClientSelection={this.handleClientSelection} />
          ) : (
            <div
              style={{
              }}
            >
              <ThemeProvider
                theme={createTheme({
                  palette: {
                    mode: "dark",
                  },
                })}
              >
                <Paper
                  style={{
                    borderRadius: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.5em",
                    top: "0px",
                    zIndex:"1",
                    position: "sticky"
                  }}
                >
                  <TextField
                    id="filled-basic"
                    label="Wyszukiwanie"
                    variant="filled"
                    style={{ width: "75%", marginRight: "5%" }}
                    onChange={this.handleInputChange}
                  />
                  {/* <FormControlLabel control={<Switch />} label="Historia" style={{width:"20%"}} /> */}
                  <Grid
                    component="label"
                    container
                    alignItems="center"
                    spacing={1}
                    width="20%"
                    style={{cursor: "pointer"}}
                  >
                    <FormControlLabel control={<Switch defaultChecked />} label="Sprzedaż" />
                  </Grid>
                </Paper>
              </ThemeProvider>
              <Grid container spacing={4} style={{padding: "2em"}}>
                {this.state.itemsFiltered.map((item) => {
                  return (
                    <Grid item 
                    sm={8} 
                    md={6} 
                    lg={4} 
                    justifyContent="center"
                    alignItems="center"
                    key={item._id}>
                      <CItem
                        key={item._id}
                        onItemClick={this.handleDialogOpen}
                        _id={item._id}
                        name={item.name}
                        price={item.price}
                        image={item.image}
                        unitsAviable={item.unitsAviable}
                        unitsTotal={item.unitsTotal}
                        createdOn={item.createdOn}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          )}
        </div>
        <Dialog open={this.state.dialogOpen}>
          <Box
            style={{
              padding: "25px",
            }}
          >
            <form
              onSubmit={(e) => {
                if (
                  e.target[0].value !== "" &&
                  this.selectedItem.unitsAviable > 0
                ) {
                  e.preventDefault();
                  this.handleDialogClose();
                  this.markCurrentItemAsSelected(e.target[0].value);
                } else {
                  e.preventDefault();
                }
              }}
            >
              <Typography gutterBottom variant="h5" component="div">
                {this.selectedItem.unitsAviable > 0
                  ? "Podaj numer rowerka:"
                  : "Brak dostępnych sztuk"}
              </Typography>
              <div style={{ width: "100%" }}>
                <TextField
                  autoComplete="off"
                  style={{
                    marginBottom: 25,
                    marginTop: 25,
                    width: "100%",
                  }}
                  value={this.state.modalInput}
                  variant="outlined"
                  label={
                    this.selectedItem.unitsAviable === 0
                      ? "Brak dostępnych sztuk"
                      : "Identyfikator"
                  }
                  disabled={this.selectedItem.unitsAviable <= 0}
                  onChange={this.handleModalInputChange}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  color="success"
                  variant="contained"
                  disabled={
                    this.state.modalInput === "" ||
                    this.selectedItem.unitsAviable === 0
                  }
                  style={{
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                >
                  Dodaj do zamówienia
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={this.handleDialogClose}
                  style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                >
                  Anuluj
                </Button>
              </div>
            </form>
          </Box>
        </Dialog>
        <CModalConfirmCreateOrder
          clientName={this.state.selectedClientName}
          itemsInOrder={this.state.rentalItemsSelected}
          isOpen={this.state.confirmOrderDialogOpen}
          resolveCallback={this.handleOrderConfirm}
        />
        <CSnackBar
          open={this.state.showSnackBar}
          message={this.state.snackBarMessage}
        />
      </div>
    );
  }
}
