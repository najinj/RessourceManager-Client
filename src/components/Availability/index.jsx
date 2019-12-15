/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { List } from "antd";
import AvailabilityForm from "../AvailabilityForm";
import Reservation from "../Reservation";

import { getAvailability } from "../../actions/reservation-action/action";

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

const Availability = ({ resources, resourceType, checkAvailability }) => {
  const [availabilityFilter, SetAvailabilityFilter] = useState(null);
  const getCronosExpression = (date, days) => {
    return `${date.format("mm")} ${date.format("HH")} * * ${
      days.length === 7 ? "*" : days.toString()
    }`;
  };
  const search = values => {
    const reservation = { ...values };
    if (Array.isArray(values.weekDays) && values.weekDays.length) {
      reservation.CronosExpression = getCronosExpression(
        values.startTime,
        values.weekDays
      );
    }
    reservation.start.utcOffset(0);
    reservation.end.utcOffset(0);
    reservation.start.set({
      hour: reservation.startTime.hours(),
      minute: reservation.startTime.minutes(),
      second: 0,
      millisecond: 0
    });
    reservation.end.set({
      hour: reservation.endTime.hours(),
      minute: reservation.endTime.minutes(),
      second: 0,
      millisecond: 0
    });
    SetAvailabilityFilter(reservation);
    checkAvailability(reservation);
  };
  const mappedReservations = resources.map(resource => {
    return {
      ...resource,
      start: availabilityFilter.start,
      end: availabilityFilter.end
    };
  });
  return (
    <div className="availability-container">
      <AvailabilityForm search={search} resourceTypes={resourceTypes} />
      <List
        itemLayout="vertical"
        size="sm"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 3
        }}
        dataSource={mappedReservations}
        renderItem={reservation => (
          <List.Item key={reservation.id} noBorder>
            <Reservation reservation={reservation} isAvailability />
          </List.Item>
        )}
      />
    </div>
  );
};
const mapDispachToProps = dispatch => {
  return {
    checkAvailability: criteria => dispatch(getAvailability(criteria))
  };
};

const mapStateToProps = state => {
  return {
    resources: state.reservationReducer.availability.resources,
    resourceType: state.reservationReducer.availability.resourceType
  };
};

const ConnectedAvailability = connect(
  mapStateToProps,
  mapDispachToProps
)(Availability);

export default ConnectedAvailability;
