import * as React from "react";
import { render } from "react-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CreateOrderMenu from "./screens/CreateOrderMenu";
import { Global, css } from "@emotion/react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

render(<>
    <Global styles={css`
        body,html {
            margin:0;
            padding:0;
            height: 100vh;
        }
        #root {
            height:100vh;
        }
        `}/>
  <ThemeProvider theme={darkTheme}>
    <CreateOrderMenu />
  </ThemeProvider>
  </>,
  document.getElementById("root")
);
