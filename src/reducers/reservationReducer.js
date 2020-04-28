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
  EMPTY_RESERVATION_FORM,
  FILL_AVAILABILITY_FORM,
  EMPTY_AVAILABILITY_FORM,
  EMPTY_AVAILABILITY_RESOUCRES,
  SET_USER_ACTION
} from "../actions/reservation-action/types";

const intialState = {
  calendarState: {
    reservations: [],
    reservationForm: {
      visible: false,
      loading: false,
      errors: null,
      fields: [],
      userAction: null
    },
    resourceId: null
  },
  allReservations: [],
  userReservations: [],
  availability: {
    availabilityForm: {
      resourceType: 0,
      resourceSubTypes: undefined,
      start: null,
      startTime: null,
      end: null,
      endTime: null,
      weekDays: undefined,
      errors: []
    },
    resourceType: null,
    resources: [],
    loading: false
  },
  errors: null
};

const addReservationsForCalendarState = (state, payload) => {
  const {
    calendarState: { resourceId, reservations }
  } = state;
  if (!Array.isArray(payload) && payload.resourceId === resourceId) {
    if (Array.isArray(payload) && payload[0].resourceId === resourceId) {
      return [...reservations, ...payload];
    }
    return [...reservations, payload];
  }
  return reservations;
};

const filterResourcesForAvailability = (state, payload) => {
  const {
    availability: { resources }
  } = state;
  if (!Array.isArray(payload)) {
    return resources.filter(resource => resource.id !== payload.resourceId);
  }
  return resources.filter(resource => resource.id !== payload[0].resourceId);
};

const reservationReducer = (state = intialState, action) => {
  switch (action.type) {
    case CHECK_AVAILABILITY_REQUEST:
      return {
        ...state,
        availability: {
          ...state.availability,
          loading: true
        }
      };
    case CHECK_AVAILABILITY_SUCCESS:
      return {
        ...state,
        availability: {
          ...state.availability,
          resources: action.payload,
          resourceType: action.payload.resourceType,
          loading: false,
          availabilityForm: {
            ...state.availability.availabilityForm,
            errors: []
          }
        }
      };
    case CHECK_AVAILABILITY_FAILURE:
      return {
        ...state,
        availability: {
          ...state.availability,
          availabilityForm: {
            ...state.availability.availabilityForm,
            errors: action.error
          },
          loading: false
        }
      };

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
          reservations: addReservationsForCalendarState(state, action.payload)
        },
        availability: {
          ...state.availability,
          resources: filterResourcesForAvailability(state, action.payload)
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
            ...state.calendarState.reservationForm,
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
            fields: [],
            errors: null,
            userAction: null
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
    case FILL_AVAILABILITY_FORM:
      return {
        ...state,
        availability: {
          ...state.availability,
          availabilityForm: {
            resourceType: action.payload.resourceType,
            resourceSubTypes: action.payload.resourceSubTypes,
            start: action.payload.start,
            startTime: action.payload.startTime,
            end: action.payload.end,
            endTime: action.payload.endTime,
            weekDays: action.payload.weekDays
          }
        }
      };
    case EMPTY_AVAILABILITY_FORM:
      return {
        ...state,
        availability: {
          ...state.availability,
          availabilityForm: intialState.availability.availabilityForm
        }
      };
    case EMPTY_AVAILABILITY_RESOUCRES:
      return {
        ...state,
        availability: {
          ...state.availability,
          resources: []
        }
      };
    case SET_USER_ACTION:
      return {
        ...state,
        calendarState: {
          ...state.calendarState,
          reservationForm: {
            ...state.calendarState.reservationForm,
            userAction: action.payload
          }
        }
      };
    default:
      return state;
  }
};

export default reservationReducer;
