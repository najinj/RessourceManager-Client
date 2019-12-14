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
  CHECK_AVAILABILITY_FAILURE,
  FILL_RESERVATION_FORM,
  EMPTY_RESERVATION_FORM
} from "../actions/reservation-action/types";

const intialState = {
  calendarState: {
    reservations: [],
    reservationForm: {
      visible: false,
      loading: false,
      errors: null,
      fields: []
    },
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
          ...state.calendarState,
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
          ...state.calendarState,
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
      return {
        ...state,
        calendarState: {
          ...state.calendarState,
          reservationForm: {
            ...state.calendarState.reservationForm,
            loading: false,
            errors: action.error
          }
        }
      };
    case FILL_RESERVATION_FORM:
      return {
        ...state,
        calendarState: {
          ...state.calendarState,
          reservationForm: {
            fields: action.payload,
            loading: false,
            visible: true,
            errors: null
          }
        }
      };
    case EMPTY_RESERVATION_FORM:
      return {
        ...state,
        calendarState: {
          ...state.calendarState,
          reservationForm: {
            loading: false,
            visible: false,
            fields: action.payload,
            errors: null
          }
        }
      };
    case DELETE_RESERVATION_REQUEST:
      return state;
    case DELETE_RESERVATION_SUCCESS:
      return {
        ...state,
        calendarState: {
          ...state.calendarState,
          reservations: state.calendarState.reservations.filter(
            reservation => reservation.id !== action.payload
          )
        },
        allReservations: state.allReservations.filter(
          reservation => reservation.id !== action.payload
        ),
        userReservations: state.userReservations.filter(
          reservation => reservation.id !== action.payload
        )
      };
    case DELETE_RESERVATION_FAILURE:
      return state;
    case DELETE_PERIODIC_RESERVATION_REQUEST:
      return state;
    case DELETE_PERIODIC_RESERVATION_SUCCESS:
      return {
        ...state,
        calendarState: {
          ...state.calendarState,
          reservations: state.calendarState.reservations.filter(
            reservation =>
              reservation.periodicId !== undefined &&
              reservation.periodicId !== action.payload
          )
        },
        allReservations: state.allReservations.filter(
          reservation =>
            reservation.periodicId !== undefined &&
            reservation.periodicId !== action.payload
        ),
        userReservations: state.userReservations.filter(
          reservation =>
            reservation.periodicId !== undefined &&
            reservation.periodicId !== action.payload
        )
      };
    case DELETE_PERIODIC_RESERVATION_FAILURE:
      return state;
    case GET_RESERVATIONS_BY_DATE_REQUEST:
      return state;
    case GET_RESERVATIONS_BY_DATE_SUCCESS:
      return {
        ...state,
        allReservations: action.payload
      };
    case GET_RESERVATIONS_BY_DATE_FAILURE:
      return state;
    default:
      return state;
  }
};

export default reservationReducer;
