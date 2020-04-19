/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Button,
  Select,
  InputNumber
} from "antd";

const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  editable,
  getFieldDecorator,
  selectOptions,
  value,
  setFields,
  ...restProps
}) => {
  const getInput = () => {
    switch (inputType) {
      case "Boolean":
        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item style={{ margin: 0 }}>
                {getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `Please Input ${title}!`
                    }
                  ],
                  initialValue: value
                })(
                  <Select initialValue="" style={{ width: 120 }}>
                    <Option value>true</Option>
                    <Option value={false}>False</Option>
                  </Select>
                )}
              </Form.Item>
            ) : (
              <span>{value.toString()}</span>
            )}
          </td>
        );
      case "Select":
        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item style={{ margin: 0 }}>
                {getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `Please Input ${title}!`
                    }
                  ],
                  initialValue: value
                })(
                  <Select initialValue="" style={{ width: 120 }}>
                    {selectOptions.map(option => (
                      <Option value={option.value}>{option.name}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            ) : (
              <span>
                {selectOptions.filter(el => el.value === String(value)).length >
                0
                  ? selectOptions.filter(el => el.value === String(value))[0]
                      .name
                  : children}
              </span>
            )}
          </td>
        );
      case "Integer":
        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item
                name={dataIndex}
                style={{
                  margin: 0
                }}
              >
                {getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `Please Input ${title}!`
                    },
                    {
                      validator: async (_, val) => {
                        if (val < 0) throw new Error("Value Must be Positive");
                      },
                      message: "Value must be greater than 0 !"
                    }
                  ],
                  initialValue: value
                })(<InputNumber />)}
              </Form.Item>
            ) : (
              children
            )}
          </td>
        );
      default:
        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item
                name={dataIndex}
                style={{
                  margin: 0
                }}
              >
                {getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `Please Input ${title}!`
                    }
                  ],
                  initialValue: value
                })(<Input />)}
              </Form.Item>
            ) : (
              children
            )}
          </td>
        );
    }
  };
  return getInput();
};

const EditableTable = ({
  form,
  settings = [],
  updateSettings,
  columns,
  settingsKey
}) => {
  const [editingKey, setEditingKey] = useState("");

  const isEditing = record => record.key === editingKey;

  const edit = record => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async () => {
    try {
      const row = await form.validateFields();
      updateSettings(row, settingsKey);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const tableColumns = [...columns];
  tableColumns.push({
    title: "operation",
    dataIndex: "operation",
    width: "10%",
    editable: false,
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <Button type="link" onClick={() => save(record.key)}>
            Save
          </Button>
          <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
            Cancel
          </Popconfirm>
        </span>
      ) : (
        <Button type="link" onClick={() => edit(record)}>
          Edit
        </Button>
      );
    }
  });
  const mergedColumns = tableColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        value: col.value,
        setFields: form.setFields,
        getFieldDecorator: form.getFieldDecorator,
        title: col.title,
        selectOptions: col.selectOptions,
        editing: isEditing(record)
      })
    };
  });
  const mappedSettings = settings.reduce(
    (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
    {}
  );

  return (
    <Form form={form} component={false}>
      {columns.length > 0 && settings.length > 0 ? (
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          style={{
            marginBottom: "5%"
          }}
          bordered
          pagination={{ position: ["none", "none"] }}
          dataSource={[mappedSettings]}
          columns={mergedColumns}
          rowClassName="editable-row"
        />
      ) : null}
    </Form>
  );
};

export default Form.create()(EditableTable);
