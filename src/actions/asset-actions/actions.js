import {
  ADD_ASSET_FAILURE,
  ADD_ASSET_REQUEST,
  ADD_ASSET_SUCCESS,
  DELETE_ASSET_FAILURE,
  DELETE_ASSET_REQUEST,
  DELETE_ASSET_SUCCESS,
  FETCH_ASSETS_FAILURE,
  FETCH_ASSETS_REQUEST,
  FETCH_ASSETS_SUCCESS,
  UPDATE_ASSET_FAILURE,
  UPDATE_ASSET_REQUEST,
  UPDATE_ASSET_SUCCESS,
  ADD_ASSET_TO_TABLE,
  DELETE_ASSET_FROM_TABLE,
  UPDATE_ASSET_FROM_TABLE,
  FILL_ASSET_FORM,
  EMPTY_ASSET_FORM
} from "./types";
import AssetsServices from "./service";

export function updateAssetRow(row) {
  return {
    type: UPDATE_ASSET_FROM_TABLE,
    payload: row
  };
}
export function addAssetRow(row) {
  return {
    type: ADD_ASSET_TO_TABLE,
    payload: row
  };
}

export function deleteAssetRow(id) {
  return {
    type: DELETE_ASSET_FROM_TABLE,
    payload: id
  };
}

export function fetchAssets() {
  return dispatch => {
    dispatch({ type: FETCH_ASSETS_REQUEST });
    AssetsServices.fetchAssets().then(
      response => {
        dispatch({
          type: FETCH_ASSETS_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(FETCH_ASSETS_FAILURE, err);
        dispatch({ type: FETCH_ASSETS_FAILURE });
      }
    );
  };
}

export function addAsset(ressourceType) {
  return dispatch => {
    dispatch({ type: ADD_ASSET_REQUEST });
    AssetsServices.addAsset(ressourceType).then(
      response => {
        dispatch(deleteAssetRow(undefined));
        dispatch({ type: ADD_ASSET_SUCCESS, payload: response.data });
        // eslint-disable-next-line no-use-before-define
        dispatch(emptyAssetForm());
      },
      err => {
        console.log(ADD_ASSET_FAILURE, err);
        dispatch({ type: ADD_ASSET_FAILURE, errors: err.response.data.errors });
      }
    );
  };
}

export function updateAsset(id, ressourceType) {
  return dispatch => {
    dispatch({ type: UPDATE_ASSET_REQUEST });
    AssetsServices.updateAsset(id, ressourceType).then(
      response => {
        dispatch({
          type: UPDATE_ASSET_SUCCESS,
          payload: response.data
        });
        // eslint-disable-next-line no-use-before-define
        dispatch(emptyAssetForm());
      },
      err => {
        console.log(UPDATE_ASSET_FAILURE, err);
        dispatch({
          type: UPDATE_ASSET_FAILURE,
          errors: err.response.data.errors
        });
      }
    );
  };
}

export function deleteAsset(id) {
  return dispatch => {
    dispatch({ type: DELETE_ASSET_REQUEST });
    AssetsServices.deleteAsset(id).then(
      () => {
        dispatch({
          type: DELETE_ASSET_SUCCESS,
          payload: id
        });
      },
      err => {
        console.log(DELETE_ASSET_FAILURE, err);
        dispatch({ type: DELETE_ASSET_FAILURE });
      }
    );
  };
}

export function fillAssetForm(asset) {
  return {
    type: FILL_ASSET_FORM,
    payload: asset
  };
}

export function emptyAssetForm() {
  return {
    type: EMPTY_ASSET_FORM,
    payload: []
  };
}
