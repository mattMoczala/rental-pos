import { Typography } from "@mui/material";
import * as React from "react";
import Fetcher from "../core/Fetcher";

interface State {}
interface Props {
    itemId: string
}

export default class COngoingRentals extends React.Component<Props, State> {

    componentDidMount(): void {
        Fetcher.getRentals(this.props.itemId,true).then((response) => {
            if (response.ok && response.data) {
              console.log(response.data)
            }
          });
    }

  render() {
    return (
      <div>
        <Typography variant="body2" color="text.secondary">
          Obecne wypożyczenia:
        </Typography>
      </div>
    );
  }
}
