/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Card, Button, Icon, Popover, Tag, Modal } from "antd";
import QueueAnim from "rc-queue-anim";
import moment from "moment";
import { connect } from "react-redux";
import {
  deletePeriodicReservations,
  deleteReservation
} from "../../actions/reservation-action/action";

const { confirm } = Modal;

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

const mapDispatchToProps = dispatch => {
  return {
    removeReservation: id => dispatch(deleteReservation(id)),
    removePeriodicReservation: id => dispatch(deletePeriodicReservations(id))
  };
};

const Reservation = ({
  reservation,
  spaces,
  removeReservation,
  removePeriodicReservation
}) => {
  const [showPeriodicReservation, SetPeriodicReservation] = useState(false);

  useEffect(() => {
    SetPeriodicReservation(false);
  }, [reservation]);
  const resourceName = spaces.reduce(
    (acc, curr) => (curr.id === reservation.resourceId ? curr.name : acc),
    ""
  );
  const resourceType = resourceTypes.reduce(
    (acc, curr) => (curr.value === reservation.resourceType ? curr.text : acc),
    ""
  );

  const show = () => {
    SetPeriodicReservation(!showPeriodicReservation);
  };
  const getWeekDaysNames = indexes => {
    const defaultWeekdays = moment.weekdays();
    console.log(defaultWeekdays);
    return indexes.map(i => defaultWeekdays[i]);
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
  return (
    <div className="reservation-container">
      <Card bordered style={{ borderLeft: "1px solid #1890ff" }}>
        <div className="icons-container">
          {reservation.periodicId !== "" ? (
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
          ) : (
            <div style={{ width: 32 }} />
          )}
        </div>
        <div className="reservation-info ant-col-19">
          <div className="reservation-header">
            <span>Resource Title</span>

            <h4>{reservation.title}</h4>
          </div>
          <div className="reservation-body">
            <div className="resourceName ant-col-5">
              <span>Resource Name</span>
              <h4>{resourceName}</h4>
            </div>
            <div className="resourceType ant-col-4">
              <span>Resource Type</span>
              <h4>{resourceType}</h4>
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
          <Button type="danger" onClick={() => cancelReservation(reservation)}>
            Cancel
          </Button>
        </div>
      </Card>
      <QueueAnim
        className="parent-reservation"
        animConfig={[
          { opacity: [1, 0], translateY: [0, 50] },
          { opacity: [1, 0], translateY: [0, -50] }
        ]}
      >
        {showPeriodicReservation
          ? [
              <Card
                bordered
                style={{ borderLeft: "1px solid #1890ff" }}
                size="small"
              >
                <div className="icons-container">
                  <Popover content="Parent reservation" trigger="hover">
                    <Icon type="calendar" style={{ fontSize: "20px" }} />
                    <Icon
                      type="sync"
                      style={{ fontSize: "14px" }}
                      rotate={60}
                    />
                  </Popover>
                </div>
                <div className="reservation-info ant-col-19">
                  <div className="reservation-header">
                    <span>Recurrency</span>
                    <h4>
                      {getWeekDaysNames([1, 2, 3, 4, 5, 6, 0]).map(day => {
                        console.log(day);
                        return <Tag key={day}>{day}</Tag>;
                      })}
                    </h4>
                  </div>
                  <div className="reservation-body">
                    <div className="resourceType ant-col-5">
                      <span>Start Date</span>
                      <h4>
                        {moment(reservation.startRecur).format("DD/MM/YYYY")}
                      </h4>
                    </div>
                    <div className="resource-date ant-col-4">
                      <span>End Date</span>
                      <h4>
                        {moment(reservation.endRecur).format("DD/MM/YYYY")}
                      </h4>
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
                  <Popover
                    content="Cancel Perdoidic Reservation"
                    trigger="hover"
                  >
                    <Button
                      type="danger"
                      onClick={() => cancelPeriodicReservation(reservation)}
                    >
                      Cancel
                    </Button>
                  </Popover>
                </div>
              </Card>
            ]
          : null}
      </QueueAnim>
    </div>
  );
};
const ConnectedTeservation = connect(
  null,
  mapDispatchToProps
)(Reservation);
export default ConnectedTeservation;
