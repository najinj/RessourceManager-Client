/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import { render } from "react-dom";
import React, { useEffect } from "react";
import { Provider, connect } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./components/App";
import { store, persistor } from "./store";
import { connectTheUser } from "./actions/auth-actions/actions";
import axiosInstance, { history } from "./config";
import { getBackOfficeSettings } from "./actions/settings-actions/actions";

const token = localStorage.getItem("token");

if (token) {
  // if token exists in local storage!
  store.dispatch(connectTheUser(token));
}

store.subscribe(() => {
  const reduxSubs = store.getState();
  if (reduxSubs.authReducer.token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${reduxSubs.authReducer.token}`;
    axiosInstance.defaults.headers.Authorization = `Bearer ${reduxSubs.authReducer.token}`;
  }
});

const WrappedApp = props => {
  useEffect(() => {
    if (token) {
      if (props.settingsModel.id == null) props.getSettings();
      // We need to check if the token are valid or not by getting the auth user
      //   props.store.dispatch(getAuthUser());
    }
  }, []);

  return (
    <>
      {/* if token is available we try to get the user once each time the app gets reloaded, so we don't need to
      fetch the auth user everytime we need him,
      */}

      {token && props.isLoadingUser ? <h1> Loading... </h1> : props.children}
    </>
  );
};

const mapStateToProps = reduxStore => {
  return {
    isLoadingUser: reduxStore.authReducer.isLoadingUser,
    settingsModel: reduxStore.settingsReducer.settingsModel
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getSettings: () => dispatch(getBackOfficeSettings())
  };
};

const ConnectedWrappedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedApp);

const Reload = () => {
  // eslint-disable-next-line react/jsx-filename-extension
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedWrappedApp store={store}>
          <App history={history} />
        </ConnectedWrappedApp>
      </PersistGate>
    </Provider>,
    document.getElementById("root")
  );
};
Reload();

console.log("test webpack");

if (module.hot) {
  module.hot.accept("./components/App", () => {
    console.log("Accepting the updated printMe module!");
    Reload();
  });
}
