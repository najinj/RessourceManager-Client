/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import { Calendar, Select, Form, Modal } from "antd";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import moment from "moment";
import {
  getReservationsByResource,
  addReservations,
  fillReservationForm,
  emptyReservationForm
} from "../../actions/reservation-action/action";
import { fetchSpaces } from "../../actions/space-actions/actions";
import ModalForm from "../ModalForm";

import "./index.css";

const mapStateToProps = state => {
  return {
    reservations: state.reservationReducer.calendarState.reservations,
    resourceId: state.reservationReducer.calendarState.resourceId,
    formVisible: state.reservationReducer.calendarState.reservationForm.visible,
    formFields: state.reservationReducer.calendarState.reservationForm.fields,
    formErrors: state.reservationReducer.calendarState.reservationForm.errors,
    formLoading: state.reservationReducer.calendarState.reservationForm.loading,
    spaces: state.spaceReducer.spaces
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadReservations: resourceId =>
      dispatch(getReservationsByResource(resourceId)),
    loadSpaces: () => dispatch(fetchSpaces()),
    openForm: form => dispatch(fillReservationForm(form)),
    closeForm: () => dispatch(emptyReservationForm()),
    addEntitie: reservation => dispatch(addReservations(reservation))
  };
};
const { Option } = Select;
const { error } = Modal;

const columns = [
  {
    title: "Resource",
    dataIndex: "resourceName",
    required: true,
    editable: false,
    inputType: "readOnly"
  },
  {
    title: "From",
    dataIndex: "start",
    editable: false,
    required: true,
    inputType: "readOnly"
  },
  {
    title: "To",
    dataIndex: "end",
    editable: false,
    required: true,
    inputType: "readOnly"
  },
  {
    title: "Description",
    dataIndex: "title",
    editable: true,
    required: false,
    inputType: "text"
  },
  {
    title: "Resource Type",
    dataIndex: "resourceType",
    editable: false,
    hidden: true,
    inputType: "hidden"
  },
  {
    title: "Resource",
    dataIndex: "resourceId",
    editable: false,
    hidden: true,
    inputType: "hidden"
  },
  {
    title: "Resource Type Name",
    dataIndex: "resourceTypeName",
    editable: false,
    hidden: true,
    inputType: "hidden"
  }
];

const CalendarView = ({
  form,
  reservations,
  resourceId,
  loadReservations,
  loadSpaces,
  spaces,
  openForm,
  closeForm,
  addEntitie,
  formVisible,
  formLoading,
  formErrors,
  formFields
}) => {
  const [userAction, SetUserAction] = useState("");

  const calendarComponentRef = React.createRef();

  useEffect(() => {
    loadSpaces();
  }, []);

  const spaceOptions = spaces.map(space => {
    return {
      text: space.name,
      value: space.id
    };
  });

  const handleCancel = () => {
    closeForm();
    SetUserAction("");
  };

  const handleAdd = arg => {
    if (resourceId == null) {
      error({
        title: `Can't Add a reservation`,
        content: `No resource has been selected , please select a resource before adding a reservation`
      });
    } else {
      const formColumns = columns.map(col => {
        return {
          ...col,
          onCell: record => ({
            key: `_${col.dataIndex}`,
            record,
            required: col.required,
            inputType: col.inputType,
            dataIndex: col.dataIndex,
            title: col.title,
            getFieldDecorator: form.getFieldDecorator,
            validateFields: form.validateFields
          })
        };
      });
      const record = {
        resourceName: spaceOptions.reduce(
          (acc, curr) => (curr.value === resourceId ? curr.text : acc),
          ""
        ),
        start: {
          value: arg.start,
          text: `${moment(arg.start).format("DD/MM/YYYY")} at ${moment(
            arg.start
          ).format("HH:mm")}`
        },
        end: {
          value: arg.end,
          text: `${moment(arg.end).format("DD/MM/YYYY")} at ${moment(
            arg.end
          ).format("HH:mm")}`
        },
        title: "",
        resourceType: 1,
        resourceId,
        resourceTypeName: spaceOptions.reduce(
          (acc, curr) => (curr.value === resourceId ? curr.text : acc),
          ""
        )
      };
      const fields = formColumns.map(col => col.onCell(record));
      openForm(fields);
      SetUserAction({ execute: addEntitie });
    }
  };
  const mappedReservations = reservations.map(reservation => {
    return {
      ...reservation,
      startRecur: null,
      endRecur: null,
      daysOfWeek: null
    };
  });

  const eventClick = info => {
    console.log(info.event);
    alert("Event: " + info.event.title);
    alert("Coordinates: " + info.jsEvent.pageX + "," + info.jsEvent.pageY);
    alert("View: " + info.view.type);
  };
  const onPanelChange = value => {
    const calendarApi = calendarComponentRef.current.getApi();
    calendarApi.gotoDate(value.format("YYYY-MM-DD")); // call a method on the Calendar object
  };

  const hadnleSpaceChange = value => {
    loadReservations(value);
  };

  return (
    <div className="calendar-container">
      <div className="select-container">
        <div className="space-select-container">
          <Select
            initialValue=""
            style={{ width: 120 }}
            onChange={hadnleSpaceChange}
            placeholder="Select a space"
          >
            {spaceOptions.map(option => (
              <Option value={option.value} key={option.value}>
                {option.text}
              </Option>
            ))}
          </Select>
        </div>
        <div className="monthly-sideview-calendar">
          <Calendar fullscreen={false} onChange={onPanelChange} />
        </div>
      </div>
      <ModalForm
        title="Title"
        action={userAction}
        onCancel={handleCancel}
        validateFields={form.validateFields}
        visible={formVisible}
        fields={formFields}
        loading={formLoading}
        errors={formErrors}
      />
      <div className="demo-app-calendar">
        <FullCalendar
          defaultView="timeGridWeek"
          header={{
            left: "prev,next today",
            center: "title",
            right: null
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          ref={calendarComponentRef}
          weekends
          events={mappedReservations}
          selectable
          select={handleAdd}
          allDaySlot={false}
          minTime="08:00:00"
          maxTime="18:00:00"
          height="auto"
          firstDay={1}
          eventClick={eventClick}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }}
        >
          <div className="fc-right">
            <button
              type="button"
              className="fc-timeGridWeek-button fc-button fc-button-primary fc-button-active"
            >
              week
            </button>
          </div>
        </FullCalendar>
      </div>
    </div>
  );
};
const CalendarViewForm = Form.create()(CalendarView);

const ConnectedCalendar = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarViewForm);

export default ConnectedCalendar;
