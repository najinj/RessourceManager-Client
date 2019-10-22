/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { func } from "prop-types";

// eslint-disable-next-line react/prop-types
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
  component: func
};
PrivateRoute.defaultProps = {
  component: null
};
export default PrivateRoute;
