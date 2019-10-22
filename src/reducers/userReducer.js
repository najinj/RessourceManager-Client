import {
  ACTIVATE_USER_ACCOUNT_REQUEST,
  ACTIVATE_USER_ACCOUNT_SUCCESS,
  ACTIVATE_USER_ACCOUNT_FAILURE,
  FETCH_USERS_ACCOUNTS_REQUEST,
  FETCH_USERS_ACCOUNTS_SUCCESS,
  FETCH_USERS_ACCOUNTS_FAILURE
} from "../actions/user-action/types";

const intialState = {
  users: [],
  isLoading: false
};

export default function userReducer(state = intialState, action) {
  switch (action.type) {
    case FETCH_USERS_ACCOUNTS_REQUEST:
      return { ...state, isLoading: true };
    case FETCH_USERS_ACCOUNTS_SUCCESS:
      return { ...state, users: action.payload, isLoading: false };
    case FETCH_USERS_ACCOUNTS_FAILURE:
      return { ...state, isLoading: true };
    case ACTIVATE_USER_ACCOUNT_REQUEST:
      return {
        ...state,
        users: state.users.map(user =>
          user.email === action.payload ? { ...user, isLoading: true } : user
        )
      };

    case ACTIVATE_USER_ACCOUNT_SUCCESS:
      return {
        ...state,
        users: state.users.map(user =>
          user.email === action.payload.email
            ? { ...user, activated: !user.activated, isLoading: false }
            : user
        )
      };
    case ACTIVATE_USER_ACCOUNT_FAILURE:
      return {
        ...state,
        users: state.users.map(user =>
          user.email === action.payload ? { ...user, isLoading: false } : user
        )
      };
    default:
      return state;
  }
}
