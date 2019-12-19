/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { func, bool } from "prop-types";

const PrivateRoute = ({ component: Component, authenticated, ...options }) => {
  console.log("Private authenticated", authenticated);
  return (
    <Route
      {...options}
      exact
      render={props =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: func,
  authenticated: bool
};
PrivateRoute.defaultProps = {
  component: null,
  authenticated: false
};
export default PrivateRoute;
