import {
  SIGNIN_ERROR,
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  DISCONNECT_THE_USER,
  CONNECT_THE_USER
} from "../actions/auth-actions/types";

const intialState = {
  email: null,
  isLoggedIn: false,
  isLoadingUser: true,
  token: null,
  errors: null
};

const authReducer = (state = intialState, action) => {
  switch (action.type) {
    // Sign in
    case SIGNIN_REQUEST:
      return state;

    case SIGNIN_SUCCESS:
      return {
        ...state,
        email: action.payload.email,
        isLoggedIn: true,
        token: action.payload.token
      };
    case SIGNIN_ERROR:
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        errors: action.errors
      };

    // Sign up
    case SIGNUP_REQUEST:
      return state;
    case SIGNUP_SUCCESS:
      return {
        ...state,
        email: action.payload.email,
        isLoggedIn: true,
        token: action.payload.token
      };
    case SIGNUP_ERROR:
      return state;

    // Connect & disconnect user ( no interaction with the server )
    case DISCONNECT_THE_USER:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        token: null
      };

    case CONNECT_THE_USER:
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token // getting token from local storage
      };
    default:
      return state;
  }
};

export default authReducer;
