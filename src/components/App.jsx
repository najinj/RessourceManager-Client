import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import WrappedSignInForm from "./SignInForm";
import PrivateRoute from "./PrivateRoute";
import LoginForm from "./LoginForm";
import SideNav from "./HomePage";
import store from "../store/index";
import { history } from "../config";

export default () => (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path="/Signup" component={WrappedSignInForm} />
        <Route exact path="/login" component={LoginForm} />
        <PrivateRoute exact path="/" component={SideNav} />
      </Switch>
    </Router>
  </Provider>
);
