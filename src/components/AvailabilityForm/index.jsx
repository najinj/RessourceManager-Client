/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Form,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Button,
  Switch
} from "antd";
import moment from "moment";
import { shape, func, arrayOf, string, number } from "prop-types";

import {
  fillAvailabilityForm,
  getAvailability,
  emptyAvailabilityForm
} from "../../actions/reservation-action/action";
import { getRessourceTypeByType } from "../../actions/ressourceTypes-actions/actions";
import "./index.css";

const { Option } = Select;

const minutesOfDay = date => {
  return date.minutes() + date.hours() * 60;
};
const getCronosExpression = (date, days) => {
  return `${date.format("mm")} ${date.format("HH")} * * ${
    days.length === 7 ? "*" : days.toString()
  }`;
};

const getParameterCaseInsensitive = (object, key) => {
  return object[
    Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())
  ];
};

const AvailabilitySearch = ({
  form,
  fillForm,
  resourceTypes,
  resourceSubTypes,
  getSubResourceTypes,
  checkAvailability,
  reservationSettings,
  errors
}) => {
  const [resourceTypeValue, SetResourceTypeValue] = useState("");
  const [periodic, SetPeriodic] = useState(false);
  const filterResourceSubTypes = val => {
    getSubResourceTypes(val);
    SetResourceTypeValue(val);
  };

  const switchToPeriodic = val => {
    SetPeriodic(val);
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
    checkAvailability(reservation);
  };

  const getFieldErrors = (fieldName, errorMessage) => {
    if (form.getFieldError(fieldName) === undefined)
      return [new Error(errorMessage)];
    return [
      ...form.getFieldError(fieldName).map(error => new Error(error)),
      new Error(errorMessage)
    ];
  };

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      let startDateWithTime = { ...values.start };
      startDateWithTime = moment(startDateWithTime).set({
        hour: values.startTime.hours(),
        minute: values.startTime.minutes(),
        second: 0,
        millisecond: 0
      });
      let endDateWithTime = { ...values.end };
      endDateWithTime = moment(endDateWithTime).set({
        hour: values.endTime.hours(),
        minute: values.endTime.minutes(),
        second: 0,
        millisecond: 0
      });

      const diff = endDateWithTime.diff(startDateWithTime, "minute");

      if (!err) {
        if (values.start.isAfter(values.end)) {
          form.setFields({
            end: {
              value: values.end,
              errors: getFieldErrors(
                "end",
                "End Date cannot be before start date"
              )
            }
          });
        }
        if (
          values.start.isSame(values.end, "day") &&
          minutesOfDay(values.startTime) >= minutesOfDay(values.endTime)
        ) {
          form.setFields({
            endTime: {
              value: values.endTime,
              errors: getFieldErrors(
                "endTime",
                "End time cannot be before start time"
              )
            }
          });
        }
        if (
          periodic &&
          !(Array.isArray(values.weekDays) && values.weekDays.length)
        ) {
          form.setFields({
            weekDays: {
              value: values.weekDays,
              errors: [
                new Error("Please select week days for this reservation")
              ]
            }
          });
        }
        if (
          values.start.isAfter(
            moment().add(
              reservationSettings.IntervalAllowedForReservations,
              "days"
            ),
            "day"
          )
        ) {
          form.setFields({
            start: {
              value: values.start,
              errors: getFieldErrors(
                "start",
                `Can't Add a reservation starting ${reservationSettings.IntervalAllowedForReservations} days from today`
              )
            }
          });
        }
        if (
          values.end.isAfter(
            moment().add(
              reservationSettings.IntervalAllowedForReservations,
              "days"
            ),
            "day"
          )
        ) {
          form.setFields({
            end: {
              value: values.end,
              errors: getFieldErrors(
                "end",
                `Can't Add a reservation ending ${reservationSettings.IntervalAllowedForReservations} days from today`
              )
            }
          });
        }
        if (
          !periodic &&
          diff / 60 > reservationSettings.MaxDurationPerReservation
        ) {
          form.setFields({
            end: {
              value: values.end,
              errors: getFieldErrors(
                "end",
                `Can't Book a resource for more than ${reservationSettings.MaxDurationPerReservation} hours`
              )
            }
          });
        } else {
          fillForm(values);
          search(values);
        }
      }
    });
  };
  return (
    <div className="availability-form-container">
      <Form onSubmit={handleSubmit}>
        <Form.Item
          style={{ margin: 0, padding: 10 }}
          label="Recource Type"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
        >
          {form.getFieldDecorator("resourceType", {
            rules: [
              { required: true, message: "Please input a  Resource Type!" }
            ],
            initialValue: null
          })(
            <Select
              initialValue=""
              onChange={val => filterResourceSubTypes(val)}
            >
              <Option value="">&nbsp;</Option>
              {resourceTypes.map(option => (
                <Option value={option.value} key={option.value}>
                  {option.text}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          style={{ margin: 0, padding: 10 }}
          label="Recource SubType"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
        >
          {form.getFieldDecorator("resourceSubTypes", {
            initialValue: undefined
          })(
            <Select initialValue="" mode="multiple">
              <Option value="">&nbsp;</Option>
              {resourceTypeValue === ""
                ? null
                : resourceSubTypes.map(option => (
                    <Option value={option.id} key={option.id}>
                      {option.name}
                    </Option>
                  ))}
            </Select>
          )}
        </Form.Item>

        <Row gutter={8} style={{ margin: 0, padding: 10 }}>
          <Form.Item
            label="Start Date"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            className="ant-col-16"
            {...(errors !== null &&
              errors !== undefined &&
              getParameterCaseInsensitive(errors, "Start") && {
                help: getParameterCaseInsensitive(errors, "Start"),
                validateStatus: "error"
              })}
          >
            <Col span={24}>
              {form.getFieldDecorator("start", {
                rules: [
                  { required: true, message: "Please input a  start Date!" },
                  {
                    validator: async (_, val) => {
                      if (val && val.diff(moment(), "days") < 0)
                        throw new Error("Can't book in the past");
                    },
                    message: "start date must be greater than today's date"
                  }
                ],
                initialValue: null
              })(<DatePicker style={{ width: "100%" }} />)}
            </Col>
          </Form.Item>
          <Form.Item
            className="ant-col-8 time-select-field"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Col span={24}>
              {form.getFieldDecorator("startTime", {
                rules: [
                  { required: true, message: "Please input a start time!" },
                  {
                    validator: async (_, val) => {
                      if (
                        val &&
                        form.getFieldValue("start").isSame(moment(), "day") &&
                        val.isBefore(moment(), "minute")
                      )
                        throw new Error("Can't book in the past");
                    },
                    message: `start Time must be greater than ${moment().format(
                      "HH:mm"
                    )}`
                  }
                ]
              })(<TimePicker style={{ width: "100%" }} />)}
            </Col>
          </Form.Item>
        </Row>

        <Row gutter={8} style={{ margin: 0, padding: 10 }}>
          <Form.Item
            label="End Date"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            className="ant-col-16"
            {...(errors !== null &&
              errors !== undefined &&
              getParameterCaseInsensitive(errors, "End") && {
                help: getParameterCaseInsensitive(errors, "End"),
                validateStatus: "error"
              })}
          >
            <Col span={24}>
              {form.getFieldDecorator("end", {
                rules: [
                  { required: true, message: "Please input a  end Date!" },
                  {
                    validator: async (_, val) => {
                      if (val && val.diff(moment(), "days") < 0)
                        throw new Error("Can't book in the past");
                    },
                    message: "start date must be greater than today's date"
                  }
                ],
                initialValue: null
              })(<DatePicker style={{ width: "100%" }} />)}
            </Col>
          </Form.Item>
          <Form.Item
            className="ant-col-8 time-select-field"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Col span={24}>
              {form.getFieldDecorator("endTime", {
                rules: [{ required: true, message: "Please input a end time!" }]
              })(<TimePicker style={{ width: "100%" }} />)}
            </Col>
          </Form.Item>
        </Row>
        <Row gutter={8}>
          <Form.Item
            label="Periodic?"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            className="ant-col-8"
            style={{ margin: 0, padding: 10 }}
          >
            <Col span={24}>
              <Switch onChange={switchToPeriodic} />
            </Col>
          </Form.Item>
          <Form.Item
            style={{ margin: 0, padding: 10, display: periodic ? "" : "none" }}
            label="Each"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 13 }}
            className="ant-col-16"
          >
            <Col span={24}>
              {form.getFieldDecorator("weekDays", {
                rules: [
                  {
                    required: false,
                    message: `Please Input Week days!`
                  }
                ],
                initialValue: undefined
              })(
                <Select mode="multiple" style={{ width: "100%" }}>
                  {moment.weekdays().map((option, index) => (
                    <Option value={index} key={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              )}
            </Col>
          </Form.Item>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Search
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    resourceSubTypes: state.ressourceTypeReducer.filters,
    reservationSettings:
      state.settingsReducer.settingsModel.reservationSettings,
    errors: state.reservationReducer.availability.availabilityForm.errors
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getSubResourceTypes: type => dispatch(getRessourceTypeByType(type)),
    fillForm: fields => dispatch(fillAvailabilityForm(fields)),
    checkAvailability: criteria => dispatch(getAvailability(criteria)),
    emptyForm: () => dispatch(emptyAvailabilityForm())
  };
};

const AvailabilitySearchForm = Form.create()(AvailabilitySearch);

AvailabilitySearch.propTypes = {
  form: shape(),
  fillForm: func,
  resourceTypes: arrayOf(
    shape({
      id: string,
      name: string,
      description: string,
      type: string,
      count: number
    })
  ),
  resourceSubTypes: arrayOf(
    shape({
      id: string,
      name: string
    })
  ),
  getSubResourceTypes: func,
  checkAvailability: func,
  reservationSettings: shape(),
  errors: arrayOf(shape())
};
AvailabilitySearch.defaultProps = {
  form: null,
  fillForm: func,
  resourceTypes: [],
  resourceSubTypes: [],
  getSubResourceTypes: func,
  checkAvailability: func,
  reservationSettings: {},
  errors: []
};

const ConnectedAvailabilitySearchForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailabilitySearchForm);

export default ConnectedAvailabilitySearchForm;
