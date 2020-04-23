import {
  SIGNIN_ERROR,
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  DISCONNECT_THE_USER,
  CONNECT_THE_USER,
  RESET_FORM_ERRORS
} from "../actions/auth-actions/types";

const intialState = {
  email: null,
  isLoggedIn: false,
  isLoadingUser: false,
  token: null,
  errors: null,
  status: null
};

const authReducer = (state = intialState, action) => {
  switch (action.type) {
    // Sign in
    case SIGNIN_REQUEST:
      return {
        ...state,
        isLoadingUser: true
      };

    case SIGNIN_SUCCESS:
      return {
        ...state,
        email: action.payload.email,
        isLoggedIn: true,
        isLoadingUser: false,
        token: action.payload.token,
        status: SIGNIN_SUCCESS
      };
    case SIGNIN_ERROR:
      return {
        ...state,
        isLoggedIn: false,
        isLoadingUser: false,
        token: null,
        errors: action.errors,
        status: SIGNIN_ERROR
      };

    // Sign up
    case SIGNUP_REQUEST:
      return {
        ...state,
        isLoadingUser: true
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        email: action.payload.email,
        isLoggedIn: false,
        isLoadingUser: false,
        token: null,
        status: SIGNUP_SUCCESS
      };
    case SIGNUP_ERROR:
      return {
        ...state,
        isLoadingUser: false,
        status: SIGNUP_ERROR
      };

    // Connect & disconnect user ( no interaction with the server )
    case DISCONNECT_THE_USER:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isLoadingUser: false,
        token: null,
        status: null
      };

    case CONNECT_THE_USER:
      return {
        ...state,
        isLoggedIn: true,
        isLoadingUser: false,
        token: action.payload.token, // getting token from local storage,
        status: null
      };
    case RESET_FORM_ERRORS: {
      return {
        ...state,
        errors: null
      };
    }
    default:
      return state;
  }
};

export default authReducer;
