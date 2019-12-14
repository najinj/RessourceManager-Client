/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Card, Button, Icon, Popover, Tag } from "antd";
import QueueAnim from "rc-queue-anim";
import moment from "moment";

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

const Reservation = ({ reservation, spaces }) => {
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
  const cancelReservation = id => {
    alert(id);
  };
  const cancelPeriodicReservation = id => {
    alert(id);
  };
  return (
    <div className="reservation-container">
      <Card bordered style={{ borderLeft: "1px solid red" }}>
        <div className="icons-container">
          <Popover
            content="This reservation is included in a perdiodic reservation"
            trigger="hover"
          >
            <Icon type="calendar" style={{ fontSize: "20px" }} />
            <Icon type="sync" style={{ fontSize: "14px" }} rotate={60} />
          </Popover>
          {reservation.periodicId !== "" ? (
            <Popover content="Show parent periodic reservation" trigger="hover">
              <Button onClick={show} icon="tag" />
            </Popover>
          ) : (
            <div style={{ width: 32 }} />
          )}
        </div>
        <div className="reservation-info ant-col-20">
          <div className="reservation-header">
            <span>Resource Title</span>

            <h4>{reservation.title}</h4>
          </div>
          <div className="reservation-body">
            <div className="resourceName ant-col-5">
              <span>Resource Name</span>
              <h4>{resourceName}</h4>
            </div>
            <div className="resourceType ant-col-5">
              <span>Resource Type</span>
              <h4>{resourceType}</h4>
            </div>
            <div className="resource-date ant-col-4">
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
          <Button
            type="danger"
            onClick={() => cancelReservation(reservation.id)}
          >
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
                style={{ borderLeft: "1px solid red" }}
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
                <div className="reservation-info ant-col-20">
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
                      onClick={() =>
                        cancelPeriodicReservation(reservation.periodicId)
                      }
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

export default Reservation;
