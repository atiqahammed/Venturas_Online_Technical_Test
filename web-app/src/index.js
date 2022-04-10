import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {
  render
} from "react-dom";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from './context/AppContext';

render(
        <AppContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          </AppContextProvider>, 
        document.getElementById("root"));