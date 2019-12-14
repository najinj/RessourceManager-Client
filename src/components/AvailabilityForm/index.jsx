/* eslint-disable react/prop-types */
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

import { getRessourceTypeByType } from "../../actions/ressourceTypes-actions/actions";

import "./index.css";

const { Option } = Select;

const AvailabilitySearch = ({
  form,
  search,
  resourceTypes,
  resourceSubTypes,
  getSubResourceTypes
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

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        search(values);
        console.log("Received values of form: ", values);
      }
    });
  };
  return (
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
          <Select initialValue="" onChange={val => filterResourceSubTypes(val)}>
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
        {form.getFieldDecorator("resourceSubType", {
          rules: [
            { required: true, message: "Please input a  Sub Resource Type!" }
          ],
          initialValue: null
        })(
          <Select initialValue="">
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
        >
          <Col span={24}>
            {form.getFieldDecorator("startDate", {
              rules: [
                { required: true, message: "Please input a  start Date!" }
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
              rules: [{ required: true, message: "Please input a start time!" }]
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
        >
          <Col span={24}>
            {form.getFieldDecorator("endDate", {
              rules: [{ required: true, message: "Please input a  end Date!" }],
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
            {form.getFieldDecorator("periodic", {
              rules: [{ required: false }],
              initialValue: null
            })(<Switch onChange={switchToPeriodic} />)}
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
            {form.getFieldDecorator("WeekDays", {
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
        <Button type="primary" htmlType="submit" className="login-form-button">
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapStateToProps = state => {
  return {
    resourceSubTypes: state.ressourceTypeReducer.filters
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getSubResourceTypes: type => dispatch(getRessourceTypeByType(type))
  };
};

const AvailabilitySearchForm = Form.create()(AvailabilitySearch);

const ConnectedAvailabilitySearchForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailabilitySearchForm);

export default ConnectedAvailabilitySearchForm;
