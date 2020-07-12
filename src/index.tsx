import React from "react";
import ReactDOM from "react-dom";
import "./web-client/index.css";
import { routing } from "./web-client/App";
import configureAxios from "./web-client/config/configureAxios";

configureAxios();

ReactDOM.render(<React.StrictMode>{routing}</React.StrictMode>, document.getElementById("root"));
