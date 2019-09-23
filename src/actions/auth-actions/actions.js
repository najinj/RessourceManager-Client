import {
  SIGNIN_ERROR,
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
} from "./types";

import AuthServices from "./service";

export function signIn(values) {
  return async dispatch => {
    dispatch({ type: SIGNIN_REQUEST });
    try {
      const response = await AuthServices.signinRequest(values);
      dispatch({ type: SIGNIN_SUCCESS, paylod: response.data });
      localStorage.setItem("token", response.data.token);
    } catch (e) {
      dispatch({ type: SIGNIN_ERROR });
    }
  };
}

export function signUp(user) {
  return async dispatch => {
    dispatch({ type: SIGNUP_REQUEST });
    try {
      const response = await AuthServices.signUp(user);
      dispatch({ type: SIGNUP_SUCCESS, paylod: response.data });
      localStorage.setItem("token", response.data.token);
    } catch (e) {
      dispatch({ type: SIGNUP_ERROR });
    }
  };
}

export function logout() {
  return async dispatch => {
    dispatch({ type: LOGOUT_REQUEST });
    try {
      await AuthServices.logoutRequest();
      localStorage.removeItem("halber_token");
      dispatch({ type: LOGOUT_SUCCESS });
    } catch (e) {
      dispatch({ type: LOGOUT_FAILURE });
    }
  };
}
