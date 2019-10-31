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
  UPDATE_RESSOURCE_TYPE_SUCCESS,
  ADD_RESSOURCE_TYPE_TO_TABLE,
  DELETE_RESSOURCE_TYPE_FROM_TABLE,
  GET_RESSOURCE_TYPES_BY_TYPE_REQUEST,
  GET_RESSOURCE_TYPES_BY_TYPE_SUCCESS,
  GET_RESSOURCE_TYPES_BY_TYPE_FAILURE,
  FILL_RESSOURCE_TYPE_FORM,
  EMPTY_RESSOURCE_TYPE_FORM
} from "../actions/ressourceTypes-actions/types";

const intialState = {
  ressourceTypes: [],
  ressourceTypeForm: {
    visible: false,
    loading: false,
    errors: null,
    fields: []
  },
  filters: [],
  isLoading: false,
  errors: null
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
      return { ...state, isLoading: false, errors: action.errors };
    /* *************************** */
    case ADD_RESSOURCE_TYPE_REQUEST:
      return state;

    case ADD_RESSOURCE_TYPE_SUCCESS:
      return {
        ...state,
        ressourceTypes: [...state.ressourceTypes, action.payload]
      };
    case ADD_RESSOURCE_TYPE_FAILURE:
      return {
        ...state,
        ressourceTypeForm: {
          ...state.ressourceTypeForm,
          loading: false,
          errors: action.errors
        }
      };
    /* *************************** */

    case UPDATE_RESSOURCE_TYPE_REQUEST:
      return {
        ...state,
        ressourceTypeForm: {
          ...state.ressourceTypeForm,
          loading: true
        }
      };
    case UPDATE_RESSOURCE_TYPE_SUCCESS:
      return {
        ...state,
        ressourceTypes: state.ressourceTypes.map(ressourceType => {
          if (ressourceType.id === action.payload.id) return action.payload;
          return ressourceType;
        }),
        ressourceTypeForm: {
          ...state.ressourceTypeForm,
          loading: false
        }
      };
    case UPDATE_RESSOURCE_TYPE_FAILURE:
      return {
        ...state,
        ressourceTypeForm: {
          ...state.ressourceTypeForm,
          loading: false,
          errors: action.errors
        }
      };
    /* *************************** */

    case DELETE_RESSOURCE_TYPE_REQUEST:
      return state;

    case DELETE_RESSOURCE_TYPE_SUCCESS:
      return {
        ...state,
        ressourceTypes: state.ressourceTypes.filter(
          ressourceType => ressourceType.id !== action.payload
        )
      };

    case DELETE_RESSOURCE_TYPE_FAILURE:
      return { ...state, errors: action.errors };

    /* *************************** */
    case ADD_RESSOURCE_TYPE_TO_TABLE:
      return {
        ...state,
        ressourceTypes: [...state.ressourceTypes, action.payload]
      };
    case DELETE_RESSOURCE_TYPE_FROM_TABLE:
      return {
        ...state,
        ressourceTypes: state.ressourceTypes.filter(
          ressourceType => ressourceType.id !== action.payload
        )
      };
    case GET_RESSOURCE_TYPES_BY_TYPE_REQUEST:
      return state;
    case GET_RESSOURCE_TYPES_BY_TYPE_SUCCESS:
      return {
        ...state,
        filters: action.payload
      };
    case GET_RESSOURCE_TYPES_BY_TYPE_FAILURE:
      return { ...state, errors: action.errors };
    case FILL_RESSOURCE_TYPE_FORM:
      return {
        ...state,
        ressourceTypeForm: {
          ...state.ressourceTypeForm,
          fields: action.payload,
          visible: true,
          errors: null
        }
      };
    case EMPTY_RESSOURCE_TYPE_FORM:
      return {
        ...state,
        ressourceTypeForm: {
          ...state.ressourceTypeForm,
          visible: false,
          fields: action.payload,
          errors: null
        }
      };
    default:
      return state;
  }
}
