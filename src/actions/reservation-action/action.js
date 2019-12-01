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
} from "./types";
import ReservationsServices from "./service";

export function fetchReservations() {
  return dispatch => {
    dispatch({ type: FETCH_RESERVATIONS_REQUEST });
    ReservationsServices.fetchReservations().then(
      response => {
        dispatch({ type: FETCH_RESERVATIONS_SUCCESS, payload: response.data });
      },
      err => {
        console.log(FETCH_RESERVATIONS_FAILURE, err);
        dispatch({
          type: FETCH_RESERVATIONS_FAILURE,
          error: err.response.data
        });
      }
    );
  };
}

export function deleteReservation(reservationId) {
  return dispatch => {
    dispatch({ type: DELETE_RESERVATION_REQUEST });
    ReservationsServices.deleteReservation(reservationId).then(
      () => {
        dispatch({
          type: DELETE_RESERVATION_SUCCESS
        });
      },
      err => {
        console.log(DELETE_RESERVATION_FAILURE, err);
        dispatch({
          type: DELETE_RESERVATION_FAILURE,
          error: err.response.data
        });
      }
    );
  };
}

export function deletePeriodicReservations(periodicId) {
  return dispatch => {
    dispatch({ type: DELETE_PERIODIC_RESERVATION_REQUEST });
    ReservationsServices.deletePeriodicReservations(periodicId).then(
      () => {
        dispatch({
          type: DELETE_PERIODIC_RESERVATION_SUCCESS
        });
      },
      err => {
        console.log(DELETE_PERIODIC_RESERVATION_FAILURE, err);
        dispatch({
          type: DELETE_PERIODIC_RESERVATION_FAILURE,
          error: err.response.data
        });
      }
    );
  };
}

export function addReservations(reservation) {
  return dispatch => {
    dispatch({ type: ADD_RESERVATION_REQUEST });
    ReservationsServices.addReservation(reservation).then(
      response => {
        dispatch({
          type: ADD_RESERVATION_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(ADD_RESERVATION_FAILURE, err);
        dispatch({
          type: ADD_RESERVATION_FAILURE,
          error: err.response.data
        });
      }
    );
  };
}

export function getReservationsByDate(dateTime) {
  return dispatch => {
    dispatch({ type: GET_RESERVATIONS_BY_DATE_REQUEST });
    ReservationsServices.getReservationsByDate(dateTime).then(
      response => {
        dispatch({
          type: GET_RESERVATIONS_BY_DATE_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(GET_RESERVATIONS_BY_DATE_FAILURE, err);
        dispatch({
          type: GET_RESERVATIONS_BY_DATE_FAILURE,
          error: err.response.data
        });
      }
    );
  };
}

export function getReservationsByResource(resourceId) {
  return dispatch => {
    dispatch({ type: GET_RESERVATIONS_BY_RESOURCE_REQUEST });
    ReservationsServices.getReservationsByResource(resourceId).then(
      response => {
        dispatch({
          type: GET_RESERVATIONS_BY_RESOURCE_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(GET_RESERVATIONS_BY_RESOURCE_FAILURE, err);
        dispatch({
          type: GET_RESERVATIONS_BY_RESOURCE_FAILURE,
          error: err.response.data
        });
      }
    );
  };
}

export function getPeriodicReservations(periodicId) {
  return dispatch => {
    dispatch({ type: GET_PERIODIC_RESERVATIONS_REQUEST });
    ReservationsServices.getPeriodicReservations(periodicId).then(
      response => {
        dispatch({
          type: GET_PERIODIC_RESERVATIONS_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(GET_PERIODIC_RESERVATIONS_FAILURE, err);
        dispatch({
          type: GET_PERIODIC_RESERVATIONS_FAILURE,
          error: err.response.data
        });
      }
    );
  };
}

export function getUserReservations() {
  return dispatch => {
    dispatch({ type: GET_USER_RESERVATIONS_REQUEST });
    ReservationsServices.getUserReservations().then(
      response => {
        dispatch({
          type: GET_USER_RESERVATIONS_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(GET_USER_RESERVATIONS_FAILURE, err);
        dispatch({
          type: GET_USER_RESERVATIONS_FAILURE,
          error: err.response.data
        });
      }
    );
  };
}

export function getAvailability(reservationModel) {
  return dispatch => {
    dispatch({ type: CHECK_AVAILABILITY_REQUEST });
    ReservationsServices.getAvailability(reservationModel).then(
      response => {
        dispatch({
          type: CHECK_AVAILABILITY_SUCCESS,
          payload: response.data
        });
      },
      err => {
        console.log(CHECK_AVAILABILITY_FAILURE, err);
        dispatch({
          type: CHECK_AVAILABILITY_FAILURE,
          error: err.response.data
        });
      }
    );
  };
}
