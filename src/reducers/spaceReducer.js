/* eslint-disable no-unused-vars */
import {
  ADD_SPACE_FAILURE,
  ADD_SPACE_REQUEST,
  ADD_SPACE_SUCCESS,
  DELETE_SPACE_FAILURE,
  DELETE_SPACE_REQUEST,
  DELETE_SPACE_SUCCESS,
  FETCH_SPACES_FAILURE,
  FETCH_SPACES_REQUEST,
  FETCH_SPACES_SUCCESS,
  UPDATE_SPACE_FAILURE,
  UPDATE_SPACE_REQUEST,
  UPDATE_SPACE_SUCCESS,
  ADD_SPACE_TO_TABLE,
  DELETE_SPACE_FROM_TABLE,
  ADD_ASSET_TO_SPACE_SUCCESS,
  ADD_ASSET_TO_SPACE_REQUEST,
  ADD_ASSET_TO_SPACE_FAILURE,
  REMOVE_ASSET_FROM_SPACE_FAILURE,
  REMOVE_ASSET_FROM_SPACE_SUCCESS,
  REMOVE_ASSET_FROM_SPACE_REQUEST
} from "../actions/space-actions/types";

const intialState = {
  spaces: [],
  isLoading: false
};

export default function spaceReducer(state = intialState, action) {
  switch (action.type) {
    case FETCH_SPACES_REQUEST:
      return { ...state, isLoading: true };

    case FETCH_SPACES_SUCCESS:
      return {
        ...state,
        spaces: action.payload,
        isLoading: false
      };
    case FETCH_SPACES_FAILURE:
      return { ...state, isLoading: false };
    /* *************************** */
    case ADD_SPACE_REQUEST:
      return state;

    case ADD_SPACE_SUCCESS:
      return {
        ...state,
        spaces: [...state.spaces, action.payload]
      };
    case ADD_SPACE_FAILURE:
      return state;
    /* *************************** */

    case UPDATE_SPACE_REQUEST:
      return state;
    case UPDATE_SPACE_SUCCESS:
      return {
        ...state,
        spaces: state.spaces.map(space => {
          if (space.id === action.payload.id) return action.payload;
          return space;
        })
      };
    case UPDATE_SPACE_FAILURE:
      return state;
    /* *************************** */

    case DELETE_SPACE_REQUEST:
      return state;

    case DELETE_SPACE_SUCCESS:
      return {
        ...state,
        spaces: state.spaces.filter(space => space.id !== action.payload)
      };

    case DELETE_SPACE_FAILURE:
      return state;

    /* *************************** */
    case ADD_SPACE_TO_TABLE:
      return {
        ...state,
        spaces: [...state.spaces, action.payload]
      };
    case DELETE_SPACE_FROM_TABLE:
      return {
        ...state,
        spaces: state.spaces.filter(space => space.id !== action.payload)
      };
    case ADD_ASSET_TO_SPACE_REQUEST:
      return state;
    case ADD_ASSET_TO_SPACE_SUCCESS:
      return {
        ...state,
        spaces: state.map(space => {
          if (space.id === action.payload.id) return action.payload;
          return space;
        })
      };
    case ADD_ASSET_TO_SPACE_FAILURE:
      return state;

    case REMOVE_ASSET_FROM_SPACE_REQUEST:
      return state;
    case REMOVE_ASSET_FROM_SPACE_SUCCESS:
      return {
        ...state,
        spaces: state.map(space => {
          if (space.id === action.payload.id) return action.payload;
          return space;
        })
      };
    case REMOVE_ASSET_FROM_SPACE_FAILURE:
      return state;
    default:
      return state;
  }
}
