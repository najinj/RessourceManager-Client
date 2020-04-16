import {
  GET_BACK_OFFICE_SETTINGS_SUCCESS,
  GET_BACK_OFFICE_SETTINGS_REQUEST,
  GET_BACK_OFFICE_SETTINGS_FAILURE
} from "../actions/settings-actions/types";

const initalState = {
  id: null,
  emailSettings: null,
  calendarSettings: null,
  reservationSettings: null
};

const settingsReducer = (state = initalState, action) => {
  switch (action.type) {
    case GET_BACK_OFFICE_SETTINGS_REQUEST:
      return state;

    case GET_BACK_OFFICE_SETTINGS_SUCCESS:
      return {
        ...state,
        id: action.payload.id,
        emailSettings: action.payload.emailSettings,
        calendarSettings: action.payload.calendarSettings,
        reservationSettings: action.payload.reservationSettings
      };

    case GET_BACK_OFFICE_SETTINGS_FAILURE:
      return state;

    default:
      return state;
  }
};

export default settingsReducer;
