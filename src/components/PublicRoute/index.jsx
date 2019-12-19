/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { func, bool } from "prop-types";

const PublicRoute = ({ component: Component, authenticated, ...options }) => {
  console.log("PublicRoute authenticated", authenticated);
  return (
    <Route
      {...options}
      exact
      render={props =>
        !authenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

PublicRoute.propTypes = {
  component: func,
  authenticated: bool
};
PublicRoute.defaultProps = {
  component: null,
  authenticated: false
};
export default PublicRoute;
