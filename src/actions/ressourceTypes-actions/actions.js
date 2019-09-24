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
} from "./types";
import RessourceTypesServices from "./service";

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
      response => {
        dispatch({
          type: DELETE_RESSOURCE_TYPE_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(DELETE_RESSOURCE_TYPE_FAILURE, err);
        dispatch({ type: DELETE_RESSOURCE_TYPE_FAILURE });
      }
    );
  };
}
