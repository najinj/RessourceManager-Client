/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Form, Select, DatePicker, TimePicker, Row, Col } from "antd";
import { shape, func, arrayOf, string } from "prop-types";

const { Option } = Select;

const Filter = ({ form, spaceNames, filterReservations, resourceTypes }) => {
  const [resourceIds, SetResourceIds] = useState([]);

  useEffect(() => {
    SetResourceIds(spaceNames);
  }, [spaceNames]);

  const hadnleSelectChange = (fieldId, val) => {
    filterReservations(fieldId, val);
  };

  const handleResourceTypeChange = (fieldId, val) => {
    if (val === "") {
      form.setFieldsValue({
        resourceId: ""
      });
    }
    filterReservations(fieldId, val);
  };

  const renderResourceIds = () => {
    const resourceOptions = resourceIds.map(option => (
      <Option value={option.id} key={option.id}>
        {option.name}
      </Option>
    ));
    return resourceOptions;
  };
  const handleSubmit = () => {};
  return (
    <Form onSubmit={handleSubmit}>
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
            onChange={val => handleResourceTypeChange("resourceType", val)}
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
            {renderResourceIds()}
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

Filter.propTypes = {
  form: shape(),
  spaceNames: arrayOf(
    shape({
      name: string,
      id: string
    })
  ),
  filterReservations: func,
  resourceTypes: arrayOf(
    shape({
      value: string,
      test: string
    })
  )
};
Filter.defaultProps = {
  form: {},
  spaceNames: [],
  filterReservations: func,
  resourceTypes: []
};

export default FilterForm;
