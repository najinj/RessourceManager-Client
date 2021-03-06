/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import { Calendar, Select, Form, Modal } from "antd";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import moment from "moment";
import { shape, func, arrayOf, bool, number, string } from "prop-types";

import {
  getReservationsByResource,
  addReservations,
  fillReservationForm,
  emptyReservationForm
} from "../../actions/reservation-action/action";
import { fetchAssets } from "../../actions/asset-actions/actions";
import { fetchSpaces } from "../../actions/space-actions/actions";
import ModalForm from "../../components/ModalForm";

import "./index.css";

const mapStateToProps = state => {
  return {
    reservations: state.reservationReducer.calendarState.reservations,
    resourceId: state.reservationReducer.calendarState.resourceId,
    formVisible: state.reservationReducer.calendarState.reservationForm.visible,
    formFields: state.reservationReducer.calendarState.reservationForm.fields,
    formErrors: state.reservationReducer.calendarState.reservationForm.errors,
    formLoading: state.reservationReducer.calendarState.reservationForm.loading,
    spaces: state.spaceReducer.spaces,
    assets: state.assetReducer.assets,
    calendarSettings: state.settingsReducer.settingsModel.calendarSettings,
    reservationSettings: state.settingsReducer.settingsModel.reservationSettings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadReservations: resourceId =>
      dispatch(getReservationsByResource(resourceId)),
    loadSpaces: () => dispatch(fetchSpaces()),
    openForm: form => dispatch(fillReservationForm(form)),
    closeForm: () => dispatch(emptyReservationForm()),
    addEntitie: reservation => dispatch(addReservations(reservation)),
    loadAssets: () => dispatch(fetchAssets())
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
    inputType: ["label"]
  },
  {
    title: "From",
    dataIndex: "start",
    editable: false,
    required: true,
    inputType: ["label"]
  },
  {
    title: "To",
    dataIndex: "end",
    editable: false,
    required: true,
    inputType: ["label"]
  },
  {
    title: "Description",
    dataIndex: "title",
    editable: true,
    required: false,
    inputType: ["text"]
  },
  {
    title: "Resource Type",
    dataIndex: "resourceType",
    editable: false,
    hidden: true,
    inputType: ["hidden"]
  },
  {
    title: "Resource",
    dataIndex: "resourceId",
    editable: false,
    hidden: true,
    inputType: ["hidden"]
  },
  {
    title: "Resource Type Name",
    dataIndex: "resourceTypeName",
    editable: false,
    hidden: true,
    inputType: ["hidden"]
  }
];

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

const CalendarView = ({
  reservations,
  resourceId,
  spaces,
  assets,
  loadReservations,
  loadSpaces,
  loadAssets,
  openForm,
  closeForm,
  addEntitie,
  formVisible,
  formLoading,
  formErrors,
  formFields,
  calendarSettings,
  reservationSettings,
  form
}) => {
  const [userAction, SetUserAction] = useState("");
  const [resourceTypeSelectValue, SetResourceTypeSelectValue] = useState("");
  const calendarComponentRef = React.createRef();

  useEffect(() => {
    loadReservations(null);
  }, []);

  const spaceOptions = spaces.map(space => {
    return {
      text: space.name,
      value: space.id
    };
  });

  const assetOptions = assets.map(asset => {
    return {
      text: asset.name,
      value: asset.id
    };
  });

  const handleCancel = () => {
    closeForm();
    SetUserAction("");
  };

  const validateArguments = arg => {
    const errors = [];
    const startDateWithTime = moment(arg.start);
    const endDateWithTime = moment(arg.end);
    const diff = endDateWithTime.diff(startDateWithTime, "minute");
    if (moment().diff(moment(arg.start)) > 0) {
      errors.push(`Can't add a reservation in the past`);
    }
    if (
      moment(arg.start).isAfter(
        moment().add(
          reservationSettings.IntervalAllowedForReservations,
          "days"
        ),
        "day"
      )
    ) {
      errors.push(
        `Can't Add a reservation starting ${reservationSettings.IntervalAllowedForReservations} days from today`
      );
    }
    if (
      moment(arg.end).isAfter(
        moment().add(
          reservationSettings.IntervalAllowedForReservations,
          "days"
        ),
        "day"
      )
    ) {
      errors.push(
        `Can't Add a reservation ending ${reservationSettings.IntervalAllowedForReservations} days from today`
      );
    }
    if (diff / 60 > reservationSettings.MaxDurationPerReservation) {
      errors.push(
        `Can't Book a resource for more than ${reservationSettings.MaxDurationPerReservation} hours`
      );
    }
    return errors;
  };

  const handleAdd = arg => {
    const errors = validateArguments(arg);

    if (resourceId == null) {
      error({
        title: `Can't Add a reservation`,
        content: `No resource has been selected , please select a resource before adding a reservation`
      });
    } else if (errors.length > 0) {
      error({
        title: `Can't Add a reservation`,
        content: errors.join("\n")
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
            title: col.title
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
  const mappedReservations =
    reservations.length > 0
      ? reservations.map(reservation => {
          return {
            ...reservation,
            startRecur: null,
            endRecur: null,
            daysOfWeek: null
          };
        })
      : [];
  console.log("reservations", mappedReservations);
  const eventClick = info => {
    console.log(info.event);
  };
  const onPanelChange = value => {
    const calendarApi = calendarComponentRef.current.getApi();
    calendarApi.gotoDate(value.format("YYYY-MM-DD")); // call a method on the Calendar object
  };

  const hadnleSpaceChange = value => {
    loadReservations(value);
  };

  const hadnleResourceTypeChange = value => {
    form.setFieldsValue({
      resourceId: ""
    });
    if (value === 1) loadSpaces();
    if (value === 2) loadAssets();
    SetResourceTypeSelectValue(value);
  };

  const renderOptions = () => {
    if (resourceTypeSelectValue === "") return null;
    return resourceTypeSelectValue === 1
      ? spaceOptions.map(option => (
          <Option value={option.value} key={option.value}>
            {option.text}
          </Option>
        ))
      : assetOptions.map(option => (
          <Option value={option.value} key={option.value}>
            {option.text}
          </Option>
        ));
  };

  return (
    <div className="calendar-container">
      <div className="select-container">
        <div className="space-select-container">
          <Form.Item
            style={{ margin: 0 }}
            label="Recource Type"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
          >
            <Select
              initialValue=""
              style={{ width: 120 }}
              onChange={hadnleResourceTypeChange}
              placeholder="Select a Resource Type"
            >
              <Option value="">&nbsp;</Option>
              {resourceTypes.map(option => (
                <Option value={option.value} key={option.value}>
                  {option.text}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="space-select-container">
          <Form.Item
            style={{ margin: 0 }}
            label="Recource"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
          >
            {form.getFieldDecorator("resourceId", {
              initialValue: null
            })(
              <Select
                initialValue=""
                style={{ width: 120 }}
                onChange={hadnleSpaceChange}
                placeholder="Select a space"
              >
                {renderOptions()}
              </Select>
            )}
          </Form.Item>
        </div>
        <div className="monthly-sideview-calendar">
          <Calendar fullscreen={false} onChange={onPanelChange} />
        </div>
      </div>
      <ModalForm
        title="Calendar"
        action={userAction}
        onCancel={handleCancel}
        visible={formVisible}
        fields={formFields}
        loading={formLoading}
        errors={formErrors}
      />
      <div className="fullCalendar-container">
        {calendarSettings !== null ? (
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
            minTime={calendarSettings.minTime}
            maxTime={calendarSettings.maxTime}
            height="auto"
            firstDay={calendarSettings.firstDay}
            eventClick={eventClick}
            slotLabelFormat={{
              hour: calendarSettings.HourSlotLabelFormat,
              minute: calendarSettings.MinuteSlotLabelFormat,
              hour12: calendarSettings.Hour12SlotLabelFormat
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
        ) : null}
      </div>
    </div>
  );
};
const CalendarViewForm = Form.create()(CalendarView);

CalendarView.propTypes = {
  reservations: arrayOf(shape()),
  resourceId: string,
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
  assets: arrayOf(
    shape({
      name: string,
      SpaceId: string,
      assetTypeId: string,
      status: number
    })
  ),
  loadReservations: func,
  loadSpaces: func,
  openForm: func,
  closeForm: func,
  formVisible: bool,
  formFields: arrayOf(shape()),
  formLoading: bool,
  formErrors: arrayOf(shape()),
  addEntitie: func,
  loadAssets: func,
  calendarSettings: arrayOf(shape()),
  reservationSettings: arrayOf(shape()),
  form: shape()
};
CalendarView.defaultProps = {
  reservations: [],
  resourceId: null,
  loadReservations: func,
  loadSpaces: func,
  spaces: [],
  assets: [],
  openForm: func,
  closeForm: func,
  formVisible: false,
  formFields: null,
  formLoading: false,
  formErrors: null,
  addEntitie: null,
  loadAssets: func,
  calendarSettings: {},
  reservationSettings: {},
  form: {}
};

const ConnectedCalendar = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarViewForm);

export default ConnectedCalendar;
