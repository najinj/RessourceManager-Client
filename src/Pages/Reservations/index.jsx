import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { func, bool, arrayOf, shape } from "prop-types";
import { List } from "antd";
import moment from "moment";
import Reservation from "../../components/Reservation";
import FilterForm from "../../components/ReservationFilterForm";

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
    spaces: state.spaceReducer.spaces,
    assets: state.assetReducer.assets
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
  const [userSpaceNames, SetUserSpaceNames] = useState([]);
  const [allUsersSpaceNames, SetAllUsersSpaceNames] = useState([]);
  useEffect(() => {
    loadSpaces();
    if (!isAdmin) {
      getUserEntities();
    } else {
      getEntitiesByDate(new Date());
    }
  }, []);

  const getResourceNames = (reservations, resourceTypeId) => {
    const resourceNames = reservations.reduce((accu, curr) => {
      const resourceName =
        curr.name !== undefined ? curr.name : curr.resourceName;
      if (
        curr.resourceType === resourceTypeId &&
        filtredBy.resourceType === resourceTypeId
      )
        accu.push({ name: resourceName, id: curr.resourceId });
      return accu;
    }, []);
    const filtredNames = Array.from(
      new Set(resourceNames.map(item => item.id))
    ).map(id => {
      return {
        id,
        name: resourceNames.find(el => el.id === id).name
      };
    });
    return filtredNames;
  };

  const filterReservations = () => {
    if (!isAdmin) {
      if (userReservations.length) {
        if (filtredBy.resourceType === "") SetUserSpaceNames([]);
        else {
          const resourceNames = getResourceNames(
            userReservations,
            filtredBy.resourceType
          );
          SetUserSpaceNames(resourceNames);
        }
      }
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
      if (allReservations.length) {
        if (filtredBy.resourceType === "") SetAllUsersSpaceNames([]);
        else {
          const resourceNames = getResourceNames(
            allReservations,
            filtredBy.resourceType
          );
          SetAllUsersSpaceNames(resourceNames);
        }
      }
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
  }, [userReservations, allReservations, filtredBy]);

  const setFilters = (fieldId, val) => {
    if (fieldId === "resourceType") {
      SetFiltredBy({
        ...filtredBy,
        resourceType: val,
        resourceId: ""
      });
    } else
      SetFiltredBy({
        ...filtredBy,
        [fieldId]: val == null ? "" : val
      });
  };

  const renderReservations = reservations => {
    console.log("reservations", reservations, reservations.length);
    return reservations.length > 0 ? (
      <List
        itemLayout="vertical"
        size="sm"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 3
        }}
        dataSource={reservations}
        renderItem={reservation => (
          <List.Item key={reservation.id} noBorder>
            <Reservation reservation={reservation} isAvailability={false} />
          </List.Item>
        )}
      />
    ) : null;
  };

  return (
    <div className="reservation-root-container">
      <div className="reservation-filters">
        <FilterForm
          spaceNames={isAdmin ? allUsersSpaceNames : userSpaceNames}
          filterReservations={setFilters}
          resourceTypes={resourceTypes}
        />
      </div>
      <div className="reservations-list">
        {isAdmin
          ? renderReservations(filteredAllReservations)
          : renderReservations(filteredUserReservations)}
      </div>
    </div>
  );
};
Reservations.propTypes = {
  userReservations: arrayOf(shape()),
  allReservations: arrayOf(shape()),
  getEntitiesByDate: func,
  getUserEntities: func,
  loadSpaces: func,
  isAdmin: bool
};
Reservations.defaultProps = {
  userReservations: [],
  allReservations: [],
  getEntitiesByDate: func,
  getUserEntities: func,
  loadSpaces: func,
  isAdmin: false
};
const ConnectedReservations = connect(
  mapStateToProps,
  mapDispachToProps
)(Reservations);
export default ConnectedReservations;
