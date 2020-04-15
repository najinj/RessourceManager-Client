import {
  GET_BACK_OFFICE_SETTINGS_REQUEST,
  GET_BACK_OFFICE_SETTINGS_FAILURE,
  GET_BACK_OFFICE_SETTINGS_SUCCESS
} from "./types";
import SettingsServices from "./service";

export default function getBackOfficeSettings() {
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
