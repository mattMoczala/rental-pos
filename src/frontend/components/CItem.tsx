import * as React from "react";

import Item from "../../types/Item";
import Card from "@mui/material/Card";
import {
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  IconButton,
  Collapse,
} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {ExpandMore} from './CExpandMore'
import COngoingRentals from "./COngoingRentals";

interface State {
  expanded: boolean
}
interface Props extends Item {
  onItemClick: Function;
}


export default class CItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {expanded: false}
  }

  private handleClick = () => {
    this.props.onItemClick(this.props);
  };

  handleExpandClick = ()=> {
    const update = {expanded: !this.state.expanded};
    this.setState(update)
  }

  render() {
    const defaultImg =
      "https://cdn.toyrider.com/sites/default/files/styles/review_article_category_inline_images__650_width_/public/images/guide/43/top-end-berg-safari-af-pedal-go-kart-review-650px.jpg";

    return (
      <>
        <Card sx={{ width: "100%" }} elevation={16}>
          <CardActionArea onClick={this.handleClick}>
            <CardMedia
              component="img"
              height="10%"
              image={this.props.image !== "" ? this.props.image : defaultImg}
              alt="image of item"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" style={{marginBottom: "0px"}}>
                {this.props.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cena: {this.props.price} zł
                <br />
                Dostępnych sztuk: {this.props.unitsAviable}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions disableSpacing>
            <IconButton aria-label="add">
              <AddBoxIcon onClick={this.handleClick} />
            </IconButton>
            <ExpandMore
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="show more"
              expand={this.state.expanded}
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <COngoingRentals/>
            </CardContent>
          </Collapse>
        </Card>
      </>
    );
  }
}
