/* eslint-disable react/prop-types */
import React from "react";
import { Form, Select, DatePicker, TimePicker, Row, Col } from "antd";

const { Option } = Select;

const Filter = ({ form, spaces, filterReservations, resourceTypes }) => {
  const hadnleSelectChange = (fieldId, val) => {
    filterReservations(fieldId, val);
  };
  const handleSubmit = () => {};
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item
        style={{ margin: 0, padding: 10 }}
        label="Recource"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
      >
        {form.getFieldDecorator("resourceId", {
          initialValue: null
        })(
          <Select
            initialValue=""
            onChange={val => hadnleSelectChange("resourceId", val)}
          >
            <Option value="">&nbsp;</Option>
            {spaces.map(option => (
              <Option value={option.id} key={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item
        style={{ margin: 0, padding: 10 }}
        label="Recource Type"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
      >
        {form.getFieldDecorator("resourceType", {
          initialValue: null
        })(
          <Select
            initialValue=""
            onChange={val => hadnleSelectChange("resourceType", val)}
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
        label="Start Date"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
      >
        <Row gutter={8}>
          <Col span={12}>
            {form.getFieldDecorator("startDate", { initialValue: null })(
              <DatePicker
                onChange={val => hadnleSelectChange("startDate", val)}
              />
            )}
          </Col>
          <Col span={12}>
            {form.getFieldDecorator("startTime", { initialValue: null })(
              <TimePicker
                onChange={val => hadnleSelectChange("startTime", val)}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        style={{ margin: 0, padding: 10 }}
        label="End Date"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
      >
        <Row gutter={8}>
          <Col span={12}>
            {form.getFieldDecorator("endDate", { initialValue: null })(
              <DatePicker
                onChange={val => hadnleSelectChange("endDate", val)}
              />
            )}
          </Col>
          <Col span={12}>
            {form.getFieldDecorator("endTime", { initialValue: null })(
              <TimePicker
                onChange={val => hadnleSelectChange("endTime", val)}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

const FilterForm = Form.create()(Filter);

export default FilterForm;
