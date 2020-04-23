/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { List, Typography } from "antd";
import { shape, arrayOf, string, number, bool, func } from "prop-types";
import AvailabilityForm from "../../components/AvailabilityForm";
import Reservation from "../../components/Reservation";
import ModalForm from "../../components/ModalForm";

import {
  emptyAvailabilityResouces,
  emptyReservationForm
} from "../../actions/reservation-action/action";

const { Title } = Typography;

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

const Availability = ({
  resources,
  availabilityForm,
  loading,
  resetAvailability,
  formVisible,
  formLoading,
  formErrors,
  formFields,
  userAction,
  closeForm
}) => {
  useEffect(() => {
    resetAvailability();
  }, []);

  const mappedReservations = resources.map(resource => {
    return {
      ...resource,
      start: availabilityForm.start,
      end: availabilityForm.end,
      resourceType: availabilityForm.resourceType
    };
  });
  const handleCancel = () => {
    closeForm();
  };

  return (
    <div className="availability-container">
      <Title level={3} style={{ textAlign: "center" }}>
        Check Availability
      </Title>
      <ModalForm
        title="Availability"
        action={userAction}
        onCancel={handleCancel}
        visible={formVisible}
        fields={formFields}
        loading={formLoading}
        errors={formErrors}
      />
      <AvailabilityForm resourceTypes={resourceTypes} />
      <List
        itemLayout="vertical"
        size="sm"
        pagination={{
          pageSize: 3
        }}
        dataSource={mappedReservations}
        renderItem={reservation => (
          <List.Item key={reservation.id} noBorder>
            <Reservation
              key={reservation.id}
              reservation={reservation}
              isAvailability
              loading={loading}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    resources: state.reservationReducer.availability.resources,
    loading: state.reservationReducer.availability.loading,
    availabilityForm: state.reservationReducer.availability.availabilityForm,
    userAction:
      state.reservationReducer.calendarState.reservationForm.userAction,
    formVisible: state.reservationReducer.calendarState.reservationForm.visible,
    formFields: state.reservationReducer.calendarState.reservationForm.fields,
    formErrors: state.reservationReducer.calendarState.reservationForm.errors,
    formLoading: state.reservationReducer.calendarState.reservationForm.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetAvailability: () => dispatch(emptyAvailabilityResouces()),
    closeForm: () => dispatch(emptyReservationForm())
  };
};

const ConnectedAvailability = connect(
  mapStateToProps,
  mapDispatchToProps
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
  }),
  loading: bool,
  resetAvailability: func
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
  },
  loading: true,
  resetAvailability: null
};

export default ConnectedAvailability;
