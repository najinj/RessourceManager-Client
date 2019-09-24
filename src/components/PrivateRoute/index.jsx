/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { func } from "prop-types";

const PrivateRoute = ({ component, ...options }) => {
  const user = localStorage.getItem("token");
  return user ? (
    <Route {...options} component={component} />
  ) : (
    <Redirect to={{ pathname: "/login", state: { from: options.location } }} />
  );
};

PrivateRoute.propTypes = {
  component: func
};
PrivateRoute.defaultProps = {
  component: null
};
export default PrivateRoute;
