/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { connect } from "react-redux";
import WrappedSignInForm from "../Pages/SignInForm";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import LoginForm from "../Pages/LoginForm";
import SideNav from "./HomePage";
import ResetPasswordPage from "../Pages/ResetPassword";

const mapStateToProps = reduxStore => {
  return {
    isLoggedIn: reduxStore.authReducer.isLoggedIn,
    email: reduxStore.authReducer.email,
    isLoadingUser: reduxStore.authReducer.isLoadingUser
  };
};

const App = props => (
  <Router history={props.history}>
    <Switch>
      <PublicRoute
        exact
        path="/ResetPassword"
        component={ResetPasswordPage}
        email={props.email}
        authenticated={props.isLoggedIn}
      />
      <PublicRoute
        exact
        path="/Signup"
        component={WrappedSignInForm}
        email={props.email}
        authenticated={props.isLoggedIn}
      />
      <PublicRoute
        exact
        path="/login"
        component={LoginForm}
        email={props.email}
        authenticated={props.isLoggedIn}
      />
      <PrivateRoute
        path="/"
        component={SideNav}
        email={props.email}
        authenticated={props.isLoggedIn}
      />
    </Switch>
  </Router>
);
const ConnectedApp = connect(
  mapStateToProps,
  null
)(App);

export default ConnectedApp;
