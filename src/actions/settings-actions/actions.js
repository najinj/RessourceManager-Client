import {
  GET_BACK_OFFICE_SETTINGS_REQUEST,
  GET_BACK_OFFICE_SETTINGS_FAILURE,
  GET_BACK_OFFICE_SETTINGS_SUCCESS,
  UPDATE_BACK_OFFICE_SETTINGS_REQUEST,
  UPDATE_BACK_OFFICE_SETTINGS_SUCCESS,
  UPDATE_BACK_OFFICE_SETTINGS_FAILURE
} from "./types";
import SettingsServices from "./service";

export function getBackOfficeSettings() {
  return dispatch => {
    dispatch({ type: GET_BACK_OFFICE_SETTINGS_REQUEST });
    SettingsServices.getSettings.then(
      response => {
        dispatch({
          type: GET_BACK_OFFICE_SETTINGS_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(GET_BACK_OFFICE_SETTINGS_FAILURE, err);
        dispatch({ type: GET_BACK_OFFICE_SETTINGS_FAILURE });
      }
    );
  };
}
export function updateBackOfficeSettings(settings) {
  return dispatch => {
    dispatch({ type: UPDATE_BACK_OFFICE_SETTINGS_REQUEST });
    SettingsServices.updateSettings(settings).then(
      response => {
        dispatch({
          type: UPDATE_BACK_OFFICE_SETTINGS_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(UPDATE_BACK_OFFICE_SETTINGS_FAILURE, err);
        dispatch({ type: UPDATE_BACK_OFFICE_SETTINGS_FAILURE });
      }
    );
  };
}
