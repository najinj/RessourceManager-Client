/* eslint-disable no-unused-vars */
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
} from "../actions/asset-actions/types";

const intialState = {
  assets: [],
  assetTypeForm: {
    visible: false,
    loading: false,
    errors: null,
    fields: []
  },
  isLoading: false
};

export default function spaceReducer(state = intialState, action) {
  switch (action.type) {
    case FETCH_ASSETS_REQUEST:
      return { ...state, isLoading: true };

    case FETCH_ASSETS_SUCCESS:
      return {
        ...state,
        assets: action.payload,
        isLoading: false
      };
    case FETCH_ASSETS_FAILURE:
      return { ...state, isLoading: false };
    /* *************************** */
    case ADD_ASSET_REQUEST:
      return state;

    case ADD_ASSET_SUCCESS:
      return {
        ...state,
        assets: [...state.assets, action.payload]
      };
    case ADD_ASSET_FAILURE:
      return {
        ...state,
        assetTypeForm: {
          ...state.assetTypeForm,
          loading: false,
          errors: action.errors
        }
      };
    /* *************************** */

    case UPDATE_ASSET_REQUEST:
      return state;
    case UPDATE_ASSET_SUCCESS:
      return {
        ...state,
        assets: state.assets.map(space => {
          if (space.id === action.payload.id) return action.payload;
          return space;
        })
      };
    case UPDATE_ASSET_FAILURE:
      return {
        ...state,
        assetTypeForm: {
          ...state.assetTypeForm,
          loading: false,
          errors: action.errors
        }
      };
    /* *************************** */

    case DELETE_ASSET_REQUEST:
      return state;

    case DELETE_ASSET_SUCCESS:
      return {
        ...state,
        assets: state.assets.filter(space => space.id !== action.payload)
      };

    case DELETE_ASSET_FAILURE:
      return state;

    /* *************************** */
    case ADD_ASSET_TO_TABLE:
      return {
        ...state,
        assets: [...state.assets, action.payload]
      };
    case DELETE_ASSET_FROM_TABLE:
      return {
        ...state,
        assets: state.assets.filter(space => space.id !== action.payload)
      };

    case UPDATE_ASSET_FROM_TABLE:
      return {
        ...state,
        assets: state.assets.map(asset =>
          asset.id === undefined ? { ...asset, status: action.payload } : asset
        )
      };
    case FILL_ASSET_FORM:
      return {
        ...state,
        assetTypeForm: {
          ...state.assetTypeForm,
          fields: action.payload,
          visible: true,
          errors: null
        }
      };
    case EMPTY_ASSET_FORM:
      return {
        ...state,
        assetTypeForm: {
          ...state.assetTypeForm,
          visible: false,
          fields: action.payload,
          errors: null
        }
      };
    default:
      return state;
  }
}
