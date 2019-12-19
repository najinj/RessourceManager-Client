/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { List } from "antd";
import AvailabilityForm from "../AvailabilityForm";
import Reservation from "../Reservation";

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

const Availability = ({ resources, availabilityForm }) => {
  const mappedReservations = resources.map(resource => {
    return {
      ...resource,
      start: availabilityForm.start,
      end: availabilityForm.end,
      resourceType: availabilityForm.resourceType
    };
  });

  return (
    <div className="availability-container">
      <AvailabilityForm resourceTypes={resourceTypes} />
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

const mapStateToProps = state => {
  return {
    resources: state.reservationReducer.availability.resources,
    availabilityForm: state.reservationReducer.availability.availabilityForm
  };
};

const ConnectedAvailability = connect(
  mapStateToProps,
  null
)(Availability);

export default ConnectedAvailability;
