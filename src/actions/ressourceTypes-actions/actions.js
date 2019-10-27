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
} from "./types";
import RessourceTypesServices from "./service";

export function getRessourceTypeByType(type) {
  return dispatch => {
    dispatch({ type: GET_RESSOURCE_TYPES_BY_TYPE_REQUEST });
    RessourceTypesServices.getRessourceTypeByType(type).then(
      response => {
        dispatch({
          type: GET_RESSOURCE_TYPES_BY_TYPE_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(GET_RESSOURCE_TYPES_BY_TYPE_FAILURE, err);
        dispatch({ type: GET_RESSOURCE_TYPES_BY_TYPE_FAILURE });
      }
    );
  };
}
export function addRessourceTypeRow(row) {
  return {
    type: ADD_RESSOURCE_TYPE_TO_TABLE,
    payload: row
  };
}

export function deleteRessourceTypeRow(id) {
  return {
    type: DELETE_RESSOURCE_TYPE_FROM_TABLE,
    payload: id
  };
}

export function fetchRessourceTypes() {
  return dispatch => {
    dispatch({ type: FETCH_RESSOURCE_TYPES_REQUEST });
    RessourceTypesServices.fetchRessourceTypes().then(
      response => {
        dispatch({
          type: FETCH_RESSOURCE_TYPES_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(FETCH_RESSOURCE_TYPES_FAILURE, err);
        dispatch({ type: FETCH_RESSOURCE_TYPES_FAILURE });
      }
    );
  };
}

export function addRessourceType(ressourceType) {
  return dispatch => {
    dispatch({ type: ADD_RESSOURCE_TYPE_REQUEST });
    RessourceTypesServices.addRessourceType(ressourceType).then(
      response => {
        dispatch(deleteRessourceTypeRow(undefined));
        dispatch({ type: ADD_RESSOURCE_TYPE_SUCCESS, payload: response.data });
      },
      err => {
        console.log(ADD_RESSOURCE_TYPE_FAILURE, err);
        dispatch({ type: ADD_RESSOURCE_TYPE_FAILURE });
      }
    );
  };
}

export function updateRessourceType(id, ressourceType) {
  console.log(id, ressourceType);
  return dispatch => {
    dispatch({ type: UPDATE_RESSOURCE_TYPE_REQUEST });
    RessourceTypesServices.updateRessourceType(id, ressourceType).then(
      response => {
        dispatch({
          type: UPDATE_RESSOURCE_TYPE_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(UPDATE_RESSOURCE_TYPE_FAILURE, err);
        dispatch({ type: UPDATE_RESSOURCE_TYPE_FAILURE });
      }
    );
  };
}

export function deleteRessourceType(id) {
  return dispatch => {
    dispatch({ type: DELETE_RESSOURCE_TYPE_REQUEST });
    RessourceTypesServices.deleteRessourceType(id).then(
      () => {
        dispatch({
          type: DELETE_RESSOURCE_TYPE_SUCCESS,
          payload: id
        });
      },
      err => {
        console.log(DELETE_RESSOURCE_TYPE_FAILURE, err);
        dispatch({ type: DELETE_RESSOURCE_TYPE_FAILURE });
      }
    );
  };
}

export function fillRessourceTypeForm(ressourceType) {
  return {
    type: FILL_RESSOURCE_TYPE_FORM,
    payload: ressourceType
  };
}

export function emptyRessourceTypeForm() {
  return {
    type: EMPTY_RESSOURCE_TYPE_FORM,
    payload: null
  };
}
