import { Typography } from "@mui/material"
import * as React from "react"

interface State {

}
interface Props {

}

export default class COngoingRentals extends React.Component<State, Props> {
render() {
    return (
        <div>
            <Typography variant="body2" color="text.secondary">
                Obecne wypożyczenia:
              </Typography>
        </div>
    )
}
}