import {
  SIGNIN_ERROR,
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  CONNECT_THE_USER
} from "./types";

import AuthServices from "./service";

export function signIn(values) {
  return dispatch => {
    dispatch({ type: SIGNIN_REQUEST });
    AuthServices.signinRequest(values).then(
      response => {
        localStorage.setItem("token", response.data.token);
        console.log("token ", localStorage.getItem("token"));
        dispatch({ type: SIGNIN_SUCCESS, payload: response.data });
      },
      err => {
        console.log(err.response.data);
        dispatch({ type: SIGNIN_ERROR, errors: err.response.data });
      }
    );
  };
}

export function signUp(user) {
  return dispatch => {
    dispatch({ type: SIGNUP_REQUEST });
    AuthServices.signupRequest(user).then(
      response => {
        dispatch({ type: SIGNUP_SUCCESS, payload: response.data });
        localStorage.setItem("token", response.data.token);
      },
      err => {
        console.log(SIGNUP_ERROR, err);
        dispatch({ type: SIGNUP_ERROR });
      }
    );
  };
}
// LoginIn without interaction with the server
export function connectTheUser(token) {
  return async dispatch => {
    localStorage.setItem("token", token);
    dispatch({
      type: CONNECT_THE_USER,
      payload: {
        token
      }
    });
  };
}
// LoginOut without interaction with the server
export function logout() {
  return async dispatch => {
    dispatch({ type: LOGOUT_REQUEST });
    try {
      await AuthServices.logoutRequest();
      localStorage.removeItem("token");
      dispatch({ type: LOGOUT_SUCCESS });
    } catch (e) {
      dispatch({ type: LOGOUT_FAILURE });
    }
  };
}
