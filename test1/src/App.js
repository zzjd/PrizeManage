import React, { Component } from "react";
import Add from "./pages/Add";
import "antd/dist/antd.css";
import HomePage from "./pages/HomePage";

import { BrowserRouter as Router, withRouter, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/AddPrize/:id?">
          <Add />
        </Route>
        <Route exact path="/">
          <HomePage />
        </Route>
      </div>
    );
  }
}

export default withRouter(App);
