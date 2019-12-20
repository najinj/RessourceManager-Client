import React from "react";
import { connect } from "react-redux";
import { List } from "antd";
import { shape, arrayOf, string, number } from "prop-types";
import AvailabilityForm from "../../components/AvailabilityForm";
import Reservation from "../../components/Reservation";

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

Availability.propTypes = {
  resources: arrayOf(shape()),
  availabilityForm: shape({
    resourceType: number,
    resourceSubTypes: arrayOf(shape()),
    start: string,
    startTime: string,
    end: string,
    endTime: string,
    weekDays: arrayOf(shape())
  })
};
Availability.defaultProps = {
  resources: [],
  availabilityForm: {
    resourceType: 0,
    resourceSubTypes: undefined,
    start: null,
    startTime: null,
    end: null,
    endTime: null,
    weekDays: undefined
  }
};

export default ConnectedAvailability;
