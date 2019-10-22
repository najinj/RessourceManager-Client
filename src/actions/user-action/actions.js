import {
  ACTIVATE_USER_ACCOUNT_REQUEST,
  ACTIVATE_USER_ACCOUNT_SUCCESS,
  ACTIVATE_USER_ACCOUNT_FAILURE,
  FETCH_USERS_ACCOUNTS_REQUEST,
  FETCH_USERS_ACCOUNTS_SUCCESS,
  FETCH_USERS_ACCOUNTS_FAILURE
} from "./types";

import UserServices from "./service";

export const fetchUsers = () => {
  return dispatch => {
    dispatch({ type: FETCH_USERS_ACCOUNTS_REQUEST });
    UserServices.fetchUsers().then(
      responce => {
        dispatch({
          type: FETCH_USERS_ACCOUNTS_SUCCESS,
          payload: responce.data
        });
      },
      err => {
        console.log(err, FETCH_USERS_ACCOUNTS_FAILURE);
        dispatch({ type: FETCH_USERS_ACCOUNTS_FAILURE });
      }
    );
  };
};

export const ActivateOrDeactivateUser = email => {
  return dispatch => {
    dispatch({ type: ACTIVATE_USER_ACCOUNT_REQUEST, payload: email });
    UserServices.ActivateOrDeactivateUser(email).then(
      responce => {
        dispatch({
          type: ACTIVATE_USER_ACCOUNT_SUCCESS,
          payload: responce.data
        });
      },
      err => {
        console.log(err, ACTIVATE_USER_ACCOUNT_FAILURE);
        dispatch({ type: ACTIVATE_USER_ACCOUNT_FAILURE, payload: email });
      }
    );
  };
};
