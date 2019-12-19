import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { shape, func, arrayOf, bool, number, string } from "prop-types";
import { List } from "antd";
import moment from "moment";
import Reservation from "../Reservation";
import FilterForm from "../ReservationFilterForm";

import {
  getUserReservations,
  getReservationsByDate
} from "../../actions/reservation-action/action";

import { fetchSpaces } from "../../actions/space-actions/actions";

import "./index.css";

const resourceTypes = [
  {
    text: "Space",
    value: 1
  },
  {
    text: "Asset",
    value: 2
  }
];

const mapDispachToProps = dispatch => {
  return {
    getEntitiesByDate: date => dispatch(getReservationsByDate(date)),
    getUserEntities: () => dispatch(getUserReservations()),
    loadSpaces: () => dispatch(fetchSpaces())
  };
};

const mapStateToProps = state => {
  return {
    userReservations: state.reservationReducer.userReservations,
    allReservations: state.reservationReducer.allReservations,
    spaces: state.spaceReducer.spaces
  };
};

const minutesOfDay = date => {
  return date.minutes() + date.hours() * 60;
};
const filterByDateOrTime = (fieldId, fieldValue, item) => {
  switch (fieldId) {
    case "startDate":
      return moment(fieldValue).isSameOrBefore(moment(item), "day");
    case "startTime":
      return minutesOfDay(moment(fieldValue)) <= minutesOfDay(moment(item));
    case "endDate":
      return !moment(fieldValue).isSameOrBefore(moment(item), "day");
    case "endTime":
      return minutesOfDay(moment(fieldValue)) >= minutesOfDay(moment(item));
    default:
      return false;
  }
};

const Reservations = ({
  userReservations,
  allReservations,
  getEntitiesByDate,
  getUserEntities,
  loadSpaces,
  spaces,
  isAdmin
}) => {
  const [filteredUserReservations, SetFilteredUserReservations] = useState([]);
  const [filteredAllReservations, SetFilteredAllReservations] = useState([]);
  const [filtredBy, SetFiltredBy] = useState({
    resourceId: "",
    resourceType: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: ""
  });
  useEffect(() => {
    loadSpaces();
    if (!isAdmin) {
      getUserEntities();
    } else {
      getEntitiesByDate(new Date());
    }
  }, []);

  const filterReservations = () => {
    if (!isAdmin) {
      SetFilteredUserReservations([
        ...userReservations.filter(reservation => {
          return Object.keys(filtredBy).every(key => {
            if (filtredBy[key] === "") return true;
            if (!moment.isMoment(filtredBy[key]))
              return filtredBy[key] === reservation[key];
            if (key.includes("start"))
              return filterByDateOrTime(key, filtredBy[key], reservation.start);
            if (key.includes("end"))
              return filterByDateOrTime(key, filtredBy[key], reservation.end);
            return true;
          });
        })
      ]);
    } else {
      SetFilteredAllReservations([
        ...allReservations.filter(reservation => {
          return Object.keys(filtredBy).every(key => {
            if (filtredBy[key] === "") return true;
            if (!moment.isMoment(filtredBy[key]))
              return filtredBy[key] === reservation[key];
            if (key.includes("start"))
              return filterByDateOrTime(key, filtredBy[key], reservation.start);
            if (key.includes("end"))
              return filterByDateOrTime(key, filtredBy[key], reservation.end);
            return true;
          });
        })
      ]);
    }
  };
  useEffect(() => {
    filterReservations();
  }, [userReservations, allReservations]);
  useEffect(() => {
    filterReservations();
  }, [filtredBy]);

  const setFilters = (fieldId, val) => {
    SetFiltredBy({
      ...filtredBy,
      [fieldId]: val == null ? "" : val
    });
  };

  return (
    <div className="reservation-root-container">
      <div className="reservation-filters">
        <FilterForm
          spaces={spaces}
          filterReservations={setFilters}
          resourceTypes={resourceTypes}
        />
      </div>
      <div className="reservations-list">
        {isAdmin ? (
          <List
            itemLayout="vertical"
            size="sm"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 3
            }}
            dataSource={filteredAllReservations}
            renderItem={reservation => (
              <List.Item key={reservation.id} noBorder>
                <Reservation reservation={reservation} spaces={spaces} />
              </List.Item>
            )}
          />
        ) : (
          <List
            itemLayout="vertical"
            size="sm"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 3
            }}
            dataSource={filteredUserReservations}
            renderItem={reservation => (
              <List.Item
                key={reservation.id}
                style={{
                  borderWidth: 0,
                  borderColor: "transparent",
                  padding: 0
                }}
              >
                <Reservation reservation={reservation} spaces={spaces} />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};
Reservations.propTypes = {
  userReservations: func,
  allReservations: func,
  getEntitiesByDate: func,
  getUserEntities: func,
  loadSpaces: func,
  spaces: arrayOf(
    shape({
      id: string,
      name: string,
      capacity: number,
      spaceTypeId: string,
      count: number,
      tags: arrayOf(string),
      assets: arrayOf(string)
    })
  ),
  isAdmin: bool
};
Reservations.defaultProps = {
  userReservations: func,
  allReservations: func,
  getEntitiesByDate: func,
  getUserEntities: func,
  loadSpaces: func,
  spaces: [],
  isAdmin: false
};
const ConnectedReservations = connect(
  mapStateToProps,
  mapDispachToProps
)(Reservations);
export default ConnectedReservations;
