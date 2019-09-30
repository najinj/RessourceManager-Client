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
  REMOVE_ASSET_FROM_SPACE_REQUEST,
  GET_SPACE_REQUEST,
  GET_SPACE_SUCCESS,
  GET_SPACE_FAILURE
} from "./types";
import SpaceServices from "./service";

export function getSpace(id) {
  return dispatch => {
    dispatch({ type: GET_SPACE_REQUEST });
    SpaceServices.getSpace(id).then(
      response => {
        dispatch({
          type: GET_SPACE_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(GET_SPACE_FAILURE, err);
        dispatch({ type: GET_SPACE_FAILURE });
      }
    );
  };
}
export function addSpaceRow(row) {
  return {
    type: ADD_SPACE_TO_TABLE,
    payload: row
  };
}

export function deleteSpaceRow(id) {
  return {
    type: DELETE_SPACE_FROM_TABLE,
    payload: id
  };
}

export function fetchSpaces() {
  return dispatch => {
    dispatch({ type: FETCH_SPACES_REQUEST });
    SpaceServices.fetchSpaces().then(
      response => {
        dispatch({
          type: FETCH_SPACES_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(FETCH_SPACES_FAILURE, err);
        dispatch({ type: FETCH_SPACES_FAILURE });
      }
    );
  };
}

export function addSpace(ressourceType) {
  return dispatch => {
    dispatch({ type: ADD_SPACE_REQUEST });
    SpaceServices.addSpace(ressourceType).then(
      response => {
        dispatch(deleteSpaceRow(undefined));
        dispatch({ type: ADD_SPACE_SUCCESS, payload: response.data });
      },
      err => {
        console.log(ADD_SPACE_FAILURE, err);
        dispatch({ type: ADD_SPACE_FAILURE });
      }
    );
  };
}

export function updateSpace(id, ressourceType) {
  return dispatch => {
    dispatch({ type: UPDATE_SPACE_REQUEST });
    SpaceServices.updateSpace(id, ressourceType).then(
      response => {
        dispatch({
          type: UPDATE_SPACE_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(UPDATE_SPACE_FAILURE, err);
        dispatch({ type: UPDATE_SPACE_FAILURE });
      }
    );
  };
}

export function deleteSpace(id) {
  return dispatch => {
    dispatch({ type: DELETE_SPACE_REQUEST });
    SpaceServices.deleteSpace(id).then(
      () => {
        dispatch({
          type: DELETE_SPACE_SUCCESS,
          payload: id
        });
      },
      err => {
        console.log(DELETE_SPACE_FAILURE, err);
        dispatch({ type: DELETE_SPACE_FAILURE });
      }
    );
  };
}

export function AddAssetToSpace(assetId, spaceId) {
  return dispatch => {
    dispatch({ type: ADD_ASSET_TO_SPACE_REQUEST });
    SpaceServices.AddAssetToSpace(assetId, spaceId).then(
      response => {
        dispatch({ type: ADD_ASSET_TO_SPACE_SUCCESS, payload: response.data });
      },
      err => {
        console.log(ADD_ASSET_TO_SPACE_FAILURE, err);
        dispatch({ type: ADD_ASSET_TO_SPACE_FAILURE });
      }
    );
  };
}

export function RemoveAssetFromSpace(assetId, spaceId) {
  return dispatch => {
    dispatch({ type: REMOVE_ASSET_FROM_SPACE_REQUEST });
    SpaceServices.RemoveAssetFromSpace(assetId, spaceId).then(
      response => {
        dispatch({
          type: REMOVE_ASSET_FROM_SPACE_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(REMOVE_ASSET_FROM_SPACE_FAILURE, err);
        dispatch({ type: REMOVE_ASSET_FROM_SPACE_FAILURE });
      }
    );
  };
}
