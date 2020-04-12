/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Button, Icon, Popover, Tag, Modal, Form } from "antd";
import QueueAnim from "rc-queue-anim";
import moment from "moment";
import { connect } from "react-redux";
import { shape, func, arrayOf, bool, number, string } from "prop-types";

import {
  deletePeriodicReservations,
  deleteReservation,
  addReservations,
  fillReservationForm,
  setUserAction,
  emptyReservationForm
} from "../../actions/reservation-action/action";

import "./index.css";

const { confirm } = Modal;
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
    inputType: ["hidden", "text"]
  },
  {
    title: "Resource",
    dataIndex: "resourceId",
    editable: false,
    hidden: true,
    inputType: ["hidden", "text"]
  },
  {
    title: "CronosExpression",
    dataIndex: "cronoExpression",
    editable: false,
    hidden: true,
    inputType: ["hidden", "text"]
  },
  {
    title: "DaysOfWeek",
    dataIndex: "weekDays",
    editable: false,
    hidden: true,
    inputType: ["hidden", "text"]
  }
];

const mapDispatchToProps = dispatch => {
  return {
    removeReservation: id => dispatch(deleteReservation(id)),
    removePeriodicReservation: id => dispatch(deletePeriodicReservations(id)),
    addEntitie: reservation => dispatch(addReservations(reservation)),
    openForm: form => dispatch(fillReservationForm(form)),
    closeForm: () => dispatch(emptyReservationForm()),
    setUserAction: action => dispatch(setUserAction(action))
  };
};

const mapStateToProps = state => {
  return {
    weekDays: state.reservationReducer.availability.availabilityForm.weekDays
  };
};

const getCronosExpression = (date, days) => {
  return `${date.format("mm")} ${date.format("HH")} * * ${
    days.length === 7 ? "*" : days.toString()
  }`;
};

const Reservation = ({
  reservation,
  removeReservation,
  removePeriodicReservation,
  isAvailability,
  // eslint-disable-next-line no-unused-vars
  addEntitie,
  openForm,
  // eslint-disable-next-line no-shadow
  setUserAction,
  weekDays
}) => {
  const [showPeriodicReservation, SetPeriodicReservation] = useState(false);

  useEffect(() => {
    SetPeriodicReservation(false);
  }, [reservation]);

  const resourceName =
    reservation.name !== undefined
      ? reservation.name
      : reservation.resourceName;

  const getResourceType = () => {
    let resourceType = "";
    if (!isAvailability && reservation.resourceType === 1) {
      resourceType = "Space";
    } else if (!isAvailability && reservation.resourceType === 2) {
      resourceType = "Asset";
    } else if (isAvailability && reservation.resourceType === 1) {
      resourceType = reservation.spaceTypeName;
    } else if (isAvailability && reservation.resourceType === 2) {
      resourceType = reservation.assetTypeName;
    }
    return resourceType;
  };

  const show = () => {
    SetPeriodicReservation(!showPeriodicReservation);
  };

  const getWeekDaysNames = days => {
    const defaultWeekdays = moment.weekdays();
    return days.map(i => defaultWeekdays[i]);
  };
  const cancelReservation = reserv => {
    confirm({
      title: `Are you sure delete this Reservation?`,
      content: `Name : ${reserv.title}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        removeReservation(reserv.id);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  const cancelPeriodicReservation = reserv => {
    confirm({
      title: `Are you sure delete this Periodic Reservation?`,
      content: `Deleting this reservation will result in the removal of all related reservations `,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        removePeriodicReservation(reserv.periodicId);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  const bookReservation = e => {
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
      resourceName,
      start: {
        value: reservation.start.format(),
        text: `${moment(reservation.start).format("DD/MM/YYYY")} at ${moment(
          reservation.start
        ).format("HH:mm")}`
      },
      end: {
        value: reservation.end.format(),
        text: `${moment(reservation.end).format("DD/MM/YYYY")} at ${moment(
          reservation.end
        ).format("HH:mm")}`
      },
      title: "",
      resourceType: reservation.resourceType,
      resourceId: reservation.id,
      cronoExpression:
        Array.isArray(weekDays) && weekDays.length
          ? getCronosExpression(reservation.start, weekDays)
          : null,
      weekDays
    };

    const fields = formColumns.map(col => col.onCell(record));
    openForm(fields);
    setUserAction({ execute: addEntitie });
  };

  return (
    <div className="reservation-container">
      <Card
        bordered
        style={{ borderLeft: "1px solid #1890ff" }}
        key={reservation.id}
      >
        <div className="icons-container">
          {reservation.periodicId !== undefined &&
          reservation.periodicId !== "" ? (
            <>
              <Popover
                content="This reservation is included in a perdiodic reservation"
                trigger="hover"
              >
                <Icon type="calendar" style={{ fontSize: "20px" }} />
                <Icon type="sync" style={{ fontSize: "14px" }} rotate={60} />
              </Popover>
              <Popover
                content="Show parent periodic reservation"
                trigger="hover"
              >
                <Button onClick={show} icon="tag" />
              </Popover>
            </>
          ) : null}
        </div>
        <div className="reservation-info ant-col-19">
          {!isAvailability ? (
            <div className="reservation-header">
              <span>Reservation Title</span>
              <h4>{reservation.title}</h4>
            </div>
          ) : null}

          <div className="reservation-body">
            <div className="resourceName ant-col-5">
              <span>Resource Name</span>
              <h4>{resourceName}</h4>
            </div>
            <div className="resourceType ant-col-4">
              <span>Resource Type</span>
              <h4>{getResourceType()}</h4>
            </div>
            <div className="resource-date ant-col-5">
              <span>Date</span>
              <h4>{moment(reservation.start).format("DD/MM/YYYY")}</h4>
            </div>
            <div className="resource-time ant-col-4">
              <span>From</span>
              <h4>{moment(reservation.start).format("HH:mm")}</h4>
            </div>
            <div className="resource-time ant-col-6">
              <span>To</span>
              <h4>{moment(reservation.end).format("HH:mm")}</h4>
            </div>
          </div>
        </div>
        <div className="reservation-actions ant-col-4">
          {isAvailability ? (
            <Button type="button" onClick={bookReservation}>
              Add
            </Button>
          ) : (
            <Button
              type="danger"
              onClick={() => cancelReservation(reservation)}
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>

      {showPeriodicReservation ? (
        <QueueAnim delay={500} className="queue-simple">
          <Card
            bordered
            style={{ borderLeft: "1px solid #1890ff" }}
            size="small"
          >
            <div className="icons-container">
              <Popover content="Parent reservation" trigger="hover">
                <Icon type="calendar" style={{ fontSize: "20px" }} />
                <Icon type="sync" style={{ fontSize: "14px" }} rotate={60} />
              </Popover>
              <div style={{ width: 32 }} />
            </div>
            <div className="reservation-info ant-col-19">
              <div className="reservation-header">
                <span>Recurrency</span>
                <h4>
                  {getWeekDaysNames(reservation.weekDays).map(day => {
                    console.log(day);
                    return <Tag key={day}>{day}</Tag>;
                  })}
                </h4>
              </div>
              <div className="reservation-body">
                <div className="resourceType ant-col-5">
                  <span>Start Date</span>
                  <h4>{moment(reservation.startRecur).format("DD/MM/YYYY")}</h4>
                </div>
                <div className="resource-date ant-col-4">
                  <span>End Date</span>
                  <h4>{moment(reservation.endRecur).format("DD/MM/YYYY")}</h4>
                </div>
                <div className="resource-time ant-col-4">
                  <span>From</span>
                  <h4>{moment(reservation.start).format("HH:mm")}</h4>
                </div>
                <div className="resource-time ant-col-6">
                  <span>To</span>
                  <h4>{moment(reservation.end).format("HH:mm")}</h4>
                </div>
              </div>
            </div>
            <div className="reservation-actions ant-col-4">
              <Popover content="Cancel Perdoidic Reservation" trigger="hover">
                <Button
                  type="danger"
                  onClick={() => cancelPeriodicReservation(reservation)}
                >
                  Cancel
                </Button>
              </Popover>
            </div>
          </Card>
        </QueueAnim>
      ) : null}
    </div>
  );
};

Reservation.propTypes = {
  reservation: shape({
    periodicId: string,
    title: string,
    name: string,
    resourceId: string,
    assetTypeName: string,
    spaceTypeName: string,
    start: shape(),
    end: shape()
  }),
  removeReservation: func,
  removePeriodicReservation: func,
  isAvailability: bool,
  addEntitie: func,
  openForm: func,
  setUserAction: func
};
Reservation.defaultProps = {
  reservation: null,
  removeReservation: func,
  removePeriodicReservation: func,
  isAvailability: bool,
  addEntitie: func,
  openForm: func,
  setUserAction: func
};

const ConnectedTeservation = connect(
  mapStateToProps,
  mapDispatchToProps
)(Reservation);
export default ConnectedTeservation;
