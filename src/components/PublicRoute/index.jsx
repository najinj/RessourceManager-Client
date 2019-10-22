/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { func } from "prop-types";

// eslint-disable-next-line react/prop-types
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
  component: func
};
PublicRoute.defaultProps = {
  component: null
};
export default PublicRoute;
