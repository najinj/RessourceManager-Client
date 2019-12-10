/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Button, List } from "antd";
import moment from "moment";
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

const Reservation = ({ reservation, spaces }) => {
  const resourceName = spaces.reduce(
    (acc, curr) => (curr.id === reservation.resourceId ? curr.name : acc),
    ""
  );
  const resourceType = resourceTypes.reduce(
    (acc, curr) => (curr.value === reservation.resourceType ? curr.text : acc),
    ""
  );
  return (
    <div className="reservation-container">
      <Card bordered>
        <div className="reservation-info">
          <div className="resourceName">
            <h4>{resourceName}</h4>
            <span>Resource Name</span>
          </div>
          <div className="resourceType">
            <h4>{resourceType}</h4>
            <span>Resource Type</span>
          </div>
          <div className="resource-time-info">
            <div className="resource-date">
              <h4>{moment(reservation.start).format("DD/MM/YYYY")}</h4>
              <span>Date</span>
            </div>
            <div className="resource-time">
              <h4>{moment(reservation.start).format("HH:mm")}</h4>
              <span>From</span>
            </div>
            <div className="resource-time">
              <h4>{moment(reservation.end).format("HH:mm")}</h4>
              <span>To</span>
            </div>
          </div>
        </div>
        <div className="reservation-actions">
          <Button type="primary" style={{ marginBottom: 16 }}>
            Cancel reservation
          </Button>
        </div>
      </Card>
    </div>
  );
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
  useEffect(() => {
    loadSpaces();
    if (!isAdmin) {
      getUserEntities();
      SetFilteredUserReservations(userReservations);
    } else {
      getEntitiesByDate(new Date());
      SetFilteredAllReservations(allReservations);
    }
  }, []);
  useEffect(() => {
    if (!isAdmin) {
      SetFilteredUserReservations(userReservations);
    } else {
      SetFilteredAllReservations(allReservations);
    }
  }, [userReservations, allReservations]);

  const filterReservations = (fieldId, val) => {
    if (!moment.isMoment(val)) {
      isAdmin
        ? SetFilteredAllReservations([
            ...allReservations.filter(
              reservation => reservation[fieldId] === val
            )
          ])
        : SetFilteredUserReservations([
            ...userReservations.filter(
              reservation => reservation[fieldId] === val
            )
          ]);
    }
  };

  return (
    <div className="reservation-root-container">
      <div className="reservation-filters">
        <FilterForm
          spaces={spaces}
          filterReservations={filterReservations}
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
              <List.Item key={reservation.id}>
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
              <List.Item key={reservation.id}>
                <Reservation reservation={reservation} spaces={spaces} />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

const ConnectedReservations = connect(
  mapStateToProps,
  mapDispachToProps
)(Reservations);
export default ConnectedReservations;
