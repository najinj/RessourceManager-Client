import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import WrappedSignInForm from "./SignInForm";
import LoginForm from "./LoginForm";

export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={WrappedSignInForm} />
      <Route exact path="/test" component={LoginForm} />
    </Switch>
  </Router>
);
