import {
  GET_BACK_OFFICE_SETTINGS_SUCCESS,
  GET_BACK_OFFICE_SETTINGS_REQUEST,
  GET_BACK_OFFICE_SETTINGS_FAILURE,
  UPDATE_BACK_OFFICE_SETTINGS_FAILURE,
  UPDATE_BACK_OFFICE_SETTINGS_REQUEST,
  UPDATE_BACK_OFFICE_SETTINGS_SUCCESS
} from "../actions/settings-actions/types";

const initalState = {
  settingsViewModel: {
    id: null,
    emailSettings: null,
    calendarSettings: null,
    reservationSettings: null
  },
  settingsModel: {
    id: null,
    emailSettings: null,
    calendarSettings: null,
    reservationSettings: null
  }
};

const getSettingsModel = settings => {
  return Object.keys(settings).reduce((acc, cur) => {
    if (cur === "id") return { ...acc, id: settings.id };
    return {
      ...acc,
      [cur]: settings[cur].reduce((ac, cu) => {
        return {
          ...ac,
          [cu.name]: cu.value
        };
      }, {})
    };
  }, {});
};

const settingsReducer = (state = initalState, action) => {
  switch (action.type) {
    case GET_BACK_OFFICE_SETTINGS_REQUEST:
      return state;

    case GET_BACK_OFFICE_SETTINGS_SUCCESS:
      return {
        ...state,
        settingsViewModel: {
          id: action.payload.id,
          emailSettings: action.payload.emailSettings,
          calendarSettings: action.payload.calendarSettings,
          reservationSettings: action.payload.reservationSettings
        },
        settingsModel: getSettingsModel(action.payload)
      };

    case GET_BACK_OFFICE_SETTINGS_FAILURE:
      return state;

    case UPDATE_BACK_OFFICE_SETTINGS_REQUEST:
      return state;

    case UPDATE_BACK_OFFICE_SETTINGS_SUCCESS: {
      return {
        ...state,
        settingsViewModel: {
          id: action.payload.id,
          emailSettings: action.payload.emailSettings,
          calendarSettings: action.payload.calendarSettings,
          reservationSettings: action.payload.reservationSettings
        }
      };
    }
    case UPDATE_BACK_OFFICE_SETTINGS_FAILURE:
      return state;

    default:
      return state;
  }
};

export default settingsReducer;
