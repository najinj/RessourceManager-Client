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
  CONNECT_THE_USER,
  DISCONNECT_THE_USER,
  RESET_PASSWORD_REQUEST_REQUEST,
  RESET_PASSWORD_REQUEST_SUCCESS,
  RESET_PASSWORD_REQUEST_FAILURE,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_FORM_ERRORS
} from "./types";
import { getBackOfficeSettings } from "../settings-actions/actions";

import AuthServices from "./service";
import axiosInstance from "../../config";

export function signIn(values) {
  return dispatch => {
    dispatch({ type: SIGNIN_REQUEST });
    const bodyFormData = new FormData();
    bodyFormData.set("username", values.Email);
    bodyFormData.set("password", values.password);
    AuthServices.signinRequest(bodyFormData).then(
      response => {
        localStorage.setItem("token", response.data.access_token);
        console.log("token ", localStorage.getItem("token"));
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;
        axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.access_token}`;
        dispatch({ type: SIGNIN_SUCCESS, payload: response.data });
        dispatch(getBackOfficeSettings());
      },
      err => {
        console.log(err.response);
        dispatch({ type: SIGNIN_ERROR, errors: err.response.status });
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

export function disconnectUser() {
  localStorage.removeItem("token");
  return dispatch => {
    dispatch({ type: DISCONNECT_THE_USER });
  };
}

export function resetPasswordRequest(email) {
  return dispatch => {
    dispatch({ type: RESET_PASSWORD_REQUEST_REQUEST });
    AuthServices.resetPasswordRequest(email).then(
      response => {
        dispatch({
          type: RESET_PASSWORD_REQUEST_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(RESET_PASSWORD_REQUEST_FAILURE, err);
        dispatch({ type: RESET_PASSWORD_REQUEST_FAILURE });
      }
    );
  };
}

export function resetPassword(body) {
  return dispatch => {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    AuthServices.resetPassword(body).then(
      response => {
        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: response.data });
      },
      err => {
        console.log(RESET_PASSWORD_FAILURE, err);
        dispatch({ type: RESET_PASSWORD_FAILURE });
      }
    );
  };
}
export function resetLoginErrors() {
  return {
    type: RESET_FORM_ERRORS
  };
}
