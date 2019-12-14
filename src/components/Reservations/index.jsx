/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Button, List, Icon, Tag, Popover } from "antd";
import QueueAnim from "rc-queue-anim";
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
  const [showPeriodicReservation, SetPeriodicReservation] = useState(false);
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
          <Popover content="Cancel Reservation" trigger="hover">
            <Button type="danger" icon="close" />
          </Popover>
          {reservation.periodicId !== "" ? (
            <Popover content="Show parent periodic reservation" trigger="hover">
              <Button onClick={show} icon="tag" />
            </Popover>
          ) : null}
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
                  <Popover
                    content="This is the parent reservation"
                    trigger="hover"
                  >
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
                    <Button icon="close" type="danger" />
                  </Popover>
                </div>
              </Card>
            ]
          : null}
      </QueueAnim>
    </div>
  );
};
const minutesOfDay = date => {
  return date.minutes() + date.hours() * 60;
};
const filterByDateOrTime = (fieldId, fieldValue, item) => {
  switch (fieldId) {
    case "startDate":
      return moment(fieldValue).isSameOrBefore(moment(item), "day");
    case "startTime":
      return minutesOfDay(moment(fieldValue)) <= minutesOfDay(moment(item));
    case "endDate":
      return !moment(fieldValue).isSameOrBefore(moment(item), "day");
    case "endTime":
      return minutesOfDay(moment(fieldValue)) >= minutesOfDay(moment(item));
    default:
      return false;
  }
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
  const [filtredBy, SetFiltredBy] = useState({
    resourceId: "",
    resourceType: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: ""
  });
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

  useEffect(() => {
    if (!isAdmin) {
      SetFilteredUserReservations([
        ...userReservations.filter(reservation => {
          return Object.keys(filtredBy).every(key => {
            if (filtredBy[key] === "") return true;
            if (!moment.isMoment(filtredBy[key]))
              return filtredBy[key] === reservation[key];
            if (key.includes("start"))
              return filterByDateOrTime(key, filtredBy[key], reservation.start);
            if (key.includes("end"))
              return filterByDateOrTime(key, filtredBy[key], reservation.end);
            return true;
          });
        })
      ]);
    } else {
      SetFilteredUserReservations([
        ...allReservations.filter(reservation => {
          return Object.keys(filtredBy).every(key => {
            if (filtredBy[key] === "") return true;
            if (!moment.isMoment(filtredBy[key]))
              return filtredBy[key] === reservation[key];
            if (key.includes("start"))
              return filterByDateOrTime(key, filtredBy[key], reservation.start);
            if (key.includes("end"))
              return filterByDateOrTime(key, filtredBy[key], reservation.end);
            return true;
          });
        })
      ]);
    }
  }, [filtredBy]);

  const filterReservations = (fieldId, val) => {
    SetFiltredBy({
      ...filtredBy,
      [fieldId]: val == null ? "" : val
    });
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
              <List.Item key={reservation.id} noBorder>
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
              <List.Item
                key={reservation.id}
                style={{
                  borderWidth: 0,
                  borderColor: "transparent",
                  padding: 0
                }}
              >
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
