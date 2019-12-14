import axiosInstance from "../../config";

const fetchReservations = () =>
  axiosInstance({
    method: "GET",
    url: "Reservation/Get"
  });

const getReservationsByDate = start =>
  axiosInstance({
    method: "GET",
    url: "Reservation/GetReservationsByDate",
    params: {
      start
    }
  });

const getReservationsByResource = (resourceId, start) =>
  axiosInstance({
    method: "GET",
    url: "Reservation/GetReservationsByResource",
    params: {
      resourceId,
      start
    }
  });

const getReservation = reservationId =>
  axiosInstance({
    method: "GET",
    url: `Reservation/${reservationId}`
  });

const getPeriodicReservations = periodicId =>
  axiosInstance({
    method: "GET",
    url: "Reservation/GetPeriodicReservations",
    params: {
      periodicId
    }
  });

const getUserReservations = () =>
  axiosInstance({
    method: "GET",
    url: "Reservation/GetUserReservations"
  });

const getAvailability = reservation =>
  axiosInstance.post("Reservation/Availability", reservation);

const addReservation = ressourceType =>
  axiosInstance.post("Reservation/Create", ressourceType);

const deleteReservation = id =>
  axiosInstance({
    method: "DELETE",
    url: `Reservation/RemoveReservation/${id}`
  });

const deletePeriodicReservations = periodicId =>
  axiosInstance({
    method: "DELETE",
    url: `Reservation/RemovePeriodicReservations/${periodicId}`
  });

const ReservationsServices = {
  fetchReservations,
  getReservationsByDate,
  getReservationsByResource,
  getReservation,
  getPeriodicReservations,
  getUserReservations,
  getAvailability,
  addReservation,
  deleteReservation,
  deletePeriodicReservations
};

export default ReservationsServices;
