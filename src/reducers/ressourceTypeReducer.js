/* eslint-disable no-unused-vars */
import {
  ADD_RESSOURCE_TYPE_FAILURE,
  ADD_RESSOURCE_TYPE_REQUEST,
  ADD_RESSOURCE_TYPE_SUCCESS,
  DELETE_RESSOURCE_TYPE_FAILURE,
  DELETE_RESSOURCE_TYPE_REQUEST,
  DELETE_RESSOURCE_TYPE_SUCCESS,
  FETCH_RESSOURCE_TYPES_FAILURE,
  FETCH_RESSOURCE_TYPES_REQUEST,
  FETCH_RESSOURCE_TYPES_SUCCESS,
  UPDATE_RESSOURCE_TYPE_FAILURE,
  UPDATE_RESSOURCE_TYPE_REQUEST,
  UPDATE_RESSOURCE_TYPE_SUCCESS
} from "../actions/ressourceTypes-actions/types";

const intialState = {
  ressourceTypes: [],
  isLoading
};

export default function ressourceTypeReducer(state = intialState, action) {
  switch (action.type) {
    case FETCH_RESSOURCE_TYPES_REQUEST:
      return { ...state, isLoading: true };

    case FETCH_RESSOURCE_TYPES_SUCCESS:
      return {
        ...state,
        ressourceTypes: action.payload,
        isLoading: false
      };
    case FETCH_RESSOURCE_TYPES_FAILURE:
      return { ...state, isLoading: true };
    /* *************************** */
    case ADD_RESSOURCE_TYPE_REQUEST:
      return state;

    case ADD_RESSOURCE_TYPE_SUCCESS:
      return {
        ...state,
        ressourceTypes: [...state.ressourceTypes, action.payload]
      };
    case ADD_RESSOURCE_TYPE_FAILURE:
      return state;
    /* *************************** */

    case UPDATE_RESSOURCE_TYPE_REQUEST:
      return state;
    case UPDATE_RESSOURCE_TYPE_SUCCESS:
      return {
        ...state,
        ressourceTypes: state.ressourceTypes.map(ressourceType => {
          if (ressourceType.Id) return action.payload;
          return ressourceType;
        })
      };
    case UPDATE_RESSOURCE_TYPE_FAILURE:
      return state;
    /* *************************** */

    case DELETE_RESSOURCE_TYPE_REQUEST:
      return state;

    case DELETE_RESSOURCE_TYPE_SUCCESS:
      return {
        ...state,
        ressourceTypes: state.ressourceTypes.filter(
          ressourceType => ressourceType.id !== action.payload.id
        )
      };

    case DELETE_RESSOURCE_TYPE_FAILURE:
      return state;
    default:
      return state;
  }
}
