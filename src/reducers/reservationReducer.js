/* eslint-disable no-unused-vars */
import {
  FETCH_RESERVATIONS_REQUEST,
  FETCH_RESERVATIONS_SUCCESS,
  FETCH_RESERVATIONS_FAILURE,
  DELETE_RESERVATION_REQUEST,
  DELETE_RESERVATION_SUCCESS,
  DELETE_RESERVATION_FAILURE,
  DELETE_PERIODIC_RESERVATION_REQUEST,
  DELETE_PERIODIC_RESERVATION_SUCCESS,
  DELETE_PERIODIC_RESERVATION_FAILURE,
  ADD_RESERVATION_REQUEST,
  ADD_RESERVATION_SUCCESS,
  ADD_RESERVATION_FAILURE,
  GET_RESERVATIONS_BY_DATE_REQUEST,
  GET_RESERVATIONS_BY_DATE_SUCCESS,
  GET_RESERVATIONS_BY_DATE_FAILURE,
  GET_RESERVATIONS_BY_RESOURCE_REQUEST,
  GET_RESERVATIONS_BY_RESOURCE_SUCCESS,
  GET_RESERVATIONS_BY_RESOURCE_FAILURE,
  GET_PERIODIC_RESERVATIONS_REQUEST,
  GET_PERIODIC_RESERVATIONS_SUCCESS,
  GET_PERIODIC_RESERVATIONS_FAILURE,
  GET_USER_RESERVATIONS_REQUEST,
  GET_USER_RESERVATIONS_SUCCESS,
  GET_USER_RESERVATIONS_FAILURE,
  CHECK_AVAILABILITY_REQUEST,
  CHECK_AVAILABILITY_SUCCESS,
  CHECK_AVAILABILITY_FAILURE
} from "../actions/reservation-action/types";

const intialState = {
  calendarState: {
    reservations: [],
    resourceId: null
  },
  allReservations: [],
  userReservations: [],
  availability: [],
  errors: null
};

const reservationReducer = (state = intialState, action) => {
  switch (action.type) {
    case CHECK_AVAILABILITY_REQUEST:
      return state;
    case CHECK_AVAILABILITY_SUCCESS:
      return {
        ...state,
        availability: action.payload
      };
    case CHECK_AVAILABILITY_FAILURE:
      return state;

    case GET_USER_RESERVATIONS_REQUEST:
      return state;
    case GET_USER_RESERVATIONS_SUCCESS:
      return {
        ...state,
        userReservations: action.payload
      };
    case GET_USER_RESERVATIONS_FAILURE:
      return state;

    case GET_RESERVATIONS_BY_RESOURCE_REQUEST:
      return state;
    case GET_RESERVATIONS_BY_RESOURCE_SUCCESS:
      return {
        ...state,
        calendarState: {
          reservations: action.payload,
          resourceId: action.payload.resourceId
        }
      };
    case GET_RESERVATIONS_BY_RESOURCE_FAILURE:
      return state;

    case ADD_RESERVATION_REQUEST:
      return state;
    case ADD_RESERVATION_SUCCESS:
      return {
        ...state,
        calendarState: {
          reservations:
            // eslint-disable-next-line no-nested-ternary
            !Array.isArray(action.payload) &&
            action.payload.resourceId === state.calendarState.resourceId
              ? Array.isArray(action.payload) &&
                action.payload[0].resourceId === state.calendarState.resourceId
                ? [...state.calendarState.reservations, ...action.payload]
                : [...state.calendarState.reservations, action.payload]
              : state.calendarState.reservations
        }
      };
    case ADD_RESERVATION_FAILURE:
      return state;

    default:
      return state;
  }
};

export default reservationReducer;
