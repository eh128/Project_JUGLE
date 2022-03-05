import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//css
import "./App.css";

//components
import HomePage from "./routes/HomePage";
import SubmitPage from "./routes/SubmitPage";
import DetailPage from "./routes/DetailPage";
import UpdatePage from "./routes/UpdatePage";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/create">
          <SubmitPage />
        </Route>
        <Route exact path="/schools/:id">
          <DetailPage />
        </Route>
        <Route exact path="/schools/:id/update">
          <UpdatePage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
