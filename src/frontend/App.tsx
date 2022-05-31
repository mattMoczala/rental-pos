import * as React from "react";
import { render } from "react-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CreateOrderMenu from "./screens/CreateOrderMenu";
import { Global, css } from "@emotion/react";
import { Backdrop } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const MAX_WIDTH_TO_SHOW_BACKDROP = 480;

export default class App extends React.Component<{}, { openTiltScreenBackdrop }> {
  constructor(props) {
    super(props);
    this.state = { openTiltScreenBackdrop: window.innerWidth < MAX_WIDTH_TO_SHOW_BACKDROP };
  }

  updateWindowDimensions = () => {
    this.setState({
      openTiltScreenBackdrop: window.innerWidth < MAX_WIDTH_TO_SHOW_BACKDROP,
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  render() {
    return (
      <>
        <Global
          styles={css`
            body,
            html {
              margin: 0;
              padding: 0;
              height: 100vh;
            }
            #root {
              height: 100vh;
            }
          `}
        />
        <ThemeProvider theme={darkTheme}>
          <CreateOrderMenu />
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={this.state.openTiltScreenBackdrop}
          >
            <img src="./img/rotate-screen.gif" alt="tilt your screen" />
          </Backdrop>
        </ThemeProvider>
      </>
    );
  }
}

render(<App />, document.getElementById("root"));
