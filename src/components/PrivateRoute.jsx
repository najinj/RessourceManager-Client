import React from "react";
import { Route, Redirect } from "react-router-dom";
import { shape } from "prop-types";

const PrivateRoute = ({ component, ...options }) => {
  const { user } = localStorage.getItem("authToken");

  const finalComponent = user ? (
    component
  ) : (
    <Redirect to={{ pathname: "/login", state: { from: options.location } }} />
  );

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...options} component={finalComponent} />;
};

PrivateRoute.propTypes = {
  component: shape()
};
PrivateRoute.defaultProps = {
  component: {}
};
export default PrivateRoute;
