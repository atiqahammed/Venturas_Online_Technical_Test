import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {
  render
} from "react-dom";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";
import configureStore from "./redux/configureStore";
import { Provider } from 'react-redux'

const store = configureStore();

render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>, 
        document.getElementById("root"));